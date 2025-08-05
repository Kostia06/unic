import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

// Security constants
export const SECURITY_CONFIG = {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    JWT_EXPIRY: '2h', // Reduced from 24h
    BCRYPT_ROUNDS: 12, // Increased from 10
    SESSION_TIMEOUT: 2 * 60 * 60 * 1000, // 2 hours
};

// Input validation patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    FILENAME: /^[a-zA-Z0-9._-]+$/,
    PRODUCT_NAME: /^[a-zA-Z0-9\s\-_áéíóúñüÁÉÍÓÚÑÜ]{1,100}$/,
    PRICE: /^\d+(\.\d{1,2})?$/,
};

// Rate limiting configurations
export const RATE_LIMITS = {
    LOGIN: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 attempts per window
        message: 'Too many login attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    },
    API: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per window
        message: 'Too many requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    },
    UPLOAD: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // 10 uploads per window
        message: 'Too many upload attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    }
};

// Generate secure random token
export function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

// Hash sensitive data
export function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Validate input against patterns
export function validateInput(input, pattern) {
    if (typeof input !== 'string') return false;
    return pattern.test(input.trim());
}

// Sanitize string input
export function sanitizeString(input, maxLength = 1000) {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .slice(0, maxLength)
        .replace(/[<>\"']/g, '') // Remove potential XSS characters
        .replace(/\0/g, ''); // Remove null bytes
}

// Validate file upload
export function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // Reduced to 5MB
    const errors = [];

    if (!file) {
        errors.push('No file provided');
        return { valid: false, errors };
    }

    if (!allowedTypes.includes(file.type)) {
        errors.push('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
    }

    if (file.size > maxSize) {
        errors.push('File too large. Maximum size is 5MB.');
    }

    if (file.name && !VALIDATION_PATTERNS.FILENAME.test(file.name)) {
        errors.push('Invalid filename. Only alphanumeric characters, dots, hyphens, and underscores are allowed.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Generate secure JWT payload
export function createJWTPayload(admin) {
    return {
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        iat: Math.floor(Date.now() / 1000),
        jti: generateSecureToken(16), // JWT ID for revocation
    };
}

// Security headers
export const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self';",
};

// Failed attempt tracking (in production, use Redis or database)
const failedAttempts = new Map();

export function trackFailedAttempt(identifier) {
    const key = hashData(identifier);
    const attempts = failedAttempts.get(key) || { count: 0, lastAttempt: Date.now() };
    
    // Reset if lockout period has passed
    if (Date.now() - attempts.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
        attempts.count = 0;
    }
    
    attempts.count++;
    attempts.lastAttempt = Date.now();
    failedAttempts.set(key, attempts);
    
    return attempts;
}

export function isLocked(identifier) {
    const key = hashData(identifier);
    const attempts = failedAttempts.get(key);
    
    if (!attempts) return false;
    
    // Check if still within lockout period and exceeded max attempts
    if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        return timeSinceLastAttempt < SECURITY_CONFIG.LOCKOUT_DURATION;
    }
    
    return false;
}

export function clearFailedAttempts(identifier) {
    const key = hashData(identifier);
    failedAttempts.delete(key);
}