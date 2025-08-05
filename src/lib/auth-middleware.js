import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';
import { SECURITY_HEADERS } from './security.js';

const prisma = new PrismaClient();

// Secure JWT verification with additional checks
export async function verifyAdminToken(request) {
    try {
        // Get token from multiple sources
        const authHeader = request.headers.get('authorization');
        const cookieToken = request.headers.get('cookie')?.match(/admin_token=([^;]+)/)?.[1];
        const headerToken = request.headers.get('x-admin-token');
        
        const token = authHeader?.replace('Bearer ', '') || cookieToken || headerToken;
        
        if (!token) {
            return { valid: false, error: 'No authentication token provided' };
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.adminId || !decoded.email) {
            return { valid: false, error: 'Invalid token structure' };
        }

        // Verify admin still exists and is active
        const admin = await prisma.adminUser.findUnique({
            where: { 
                id: decoded.adminId,
                email: decoded.email,
                isActive: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true
            }
        });

        if (!admin) {
            return { valid: false, error: 'Admin user not found or inactive' };
        }

        // Check session timeout (2 hours from last login)
        const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
        if (admin.lastLogin && (Date.now() - new Date(admin.lastLogin).getTime()) > SESSION_TIMEOUT) {
            return { valid: false, error: 'Session expired' };
        }

        return { 
            valid: true, 
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        };

    } catch (error) {
        console.error('Token verification error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return { valid: false, error: 'Token expired' };
        } else if (error.name === 'JsonWebTokenError') {
            return { valid: false, error: 'Invalid token' };
        }
        
        return { valid: false, error: 'Authentication failed' };
    } finally {
        await prisma.$disconnect();
    }
}

// Middleware to protect admin routes
export async function requireAdminAuth(request) {
    const auth = await verifyAdminToken(request);
    
    if (!auth.valid) {
        return new Response(
            JSON.stringify({ error: auth.error || 'Unauthorized' }),
            { 
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...SECURITY_HEADERS
                }
            }
        );
    }
    
    return { admin: auth.admin };
}

// Rate limiting for specific endpoints
const rateLimitMap = new Map();

export function checkRateLimit(identifier, maxRequests = 100, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const key = `${identifier}`;
    
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, { requests: 0, resetTime: now + windowMs });
    }
    
    const record = rateLimitMap.get(key);
    
    // Reset if window has passed
    if (now > record.resetTime) {
        record.requests = 0;
        record.resetTime = now + windowMs;
    }
    
    record.requests++;
    
    if (record.requests > maxRequests) {
        return {
            allowed: false,
            resetTime: record.resetTime,
            remainingRequests: 0
        };
    }
    
    return {
        allowed: true,
        resetTime: record.resetTime,
        remainingRequests: maxRequests - record.requests
    };
}

// Clean up old rate limit records
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000); // Clean up every 5 minutes