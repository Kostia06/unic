import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../../../../generated/prisma';
import { 
    SECURITY_CONFIG, 
    VALIDATION_PATTERNS, 
    SECURITY_HEADERS,
    validateInput,
    sanitizeString,
    createJWTPayload,
    trackFailedAttempt,
    isLocked,
    clearFailedAttempts
} from '../../../../../lib/security.js';
import { checkRateLimit } from '../../../../../lib/auth-middleware.js';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // Get client IP for rate limiting and attempt tracking
        const clientIP = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        
        // Rate limiting check
        const rateLimit = checkRateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ 
                    error: 'Too many login attempts. Please try again later.',
                    retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
                }),
                { 
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
                        ...SECURITY_HEADERS
                    }
                }
            );
        }

        const body = await request.json();
        let { email, password } = body;

        // Input validation
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Sanitize and validate email
        email = sanitizeString(email.toLowerCase(), 255);
        if (!validateInput(email, VALIDATION_PATTERNS.EMAIL)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Check if account is locked due to failed attempts
        if (isLocked(email)) {
            return new Response(
                JSON.stringify({ 
                    error: 'Account temporarily locked due to too many failed attempts. Please try again later.',
                    lockoutDuration: SECURITY_CONFIG.LOCKOUT_DURATION / 1000
                }),
                { 
                    status: 423,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Validate password length (don't reveal password requirements to potential attackers)
        if (password.length < 6 || password.length > 128) {
            trackFailedAttempt(email);
            return new Response(
                JSON.stringify({ error: 'Invalid credentials' }),
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // REMOVED: Automatic admin creation is a security risk
        // Default admin should be created through secure setup script only

        // Find admin user with timing attack protection
        const admin = await prisma.adminUser.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true
            }
        });

        // Always perform password comparison to prevent timing attacks
        const dummyHash = '$2a$12$dummy.hash.to.prevent.timing.attacks.12345678901234567890123456';
        const providedHash = admin ? admin.password : dummyHash;
        const isValidPassword = await bcrypt.compare(password, providedHash);
        
        // Check if admin exists, is active, and password is correct
        if (!admin || !admin.isActive || !isValidPassword) {
            trackFailedAttempt(email);
            
            // Add artificial delay to prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 200));
            
            return new Response(
                JSON.stringify({ error: 'Invalid credentials' }),
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Clear failed attempts on successful login
        clearFailedAttempts(email);

        // Update last login with transaction for consistency
        await prisma.adminUser.update({
            where: { id: admin.id },
            data: { 
                lastLogin: new Date(),
                // Optionally track login IP (implement if needed)
                // lastLoginIp: clientIP
            }
        });

        // Generate secure JWT token
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
            console.error('SECURITY WARNING: JWT_SECRET not properly configured!');
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        const jwtPayload = createJWTPayload(admin);
        const token = jwt.sign(
            jwtPayload,
            process.env.JWT_SECRET,
            { 
                expiresIn: SECURITY_CONFIG.JWT_EXPIRY,
                issuer: 'unic-admin',
                audience: 'unic-admin-panel'
            }
        );

        // Set secure cookie options
        const cookieOptions = [
            `admin_token=${token}`,
            'HttpOnly',
            'Secure', // Only over HTTPS in production
            'SameSite=Strict',
            `Max-Age=${2 * 60 * 60}`, // 2 hours
            'Path=/',
        ].join('; ');

        return new Response(
            JSON.stringify({
                success: true,
                token, // Still provide token for localStorage fallback
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role
                },
                expiresIn: SECURITY_CONFIG.JWT_EXPIRY
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookieOptions,
                    ...SECURITY_HEADERS
                }
            }
        );

    } catch (error) {
        console.error('Login error:', error.message);
        
        // Don't expose internal error details
        return new Response(
            JSON.stringify({ error: 'Authentication service temporarily unavailable' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Add logout endpoint
export async function DELETE(request) {
    try {
        // Clear the authentication cookie
        const cookieOptions = [
            'admin_token=',
            'HttpOnly',
            'Secure',
            'SameSite=Strict',
            'Max-Age=0',
            'Path=/',
        ].join('; ');

        return new Response(
            JSON.stringify({ success: true, message: 'Logged out successfully' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookieOptions,
                    ...SECURITY_HEADERS
                }
            }
        );
    } catch (error) {
        console.error('Logout error:', error.message);
        return new Response(
            JSON.stringify({ error: 'Logout failed' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    }
}