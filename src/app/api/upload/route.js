import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireAdminAuth, checkRateLimit } from '../../../lib/auth-middleware.js';
import { SECURITY_HEADERS, validateFile, sanitizeString } from '../../../lib/security.js';

export async function POST(request) {
    try {
        // Authenticate admin user
        const authResult = await requireAdminAuth(request);
        if (authResult instanceof Response) {
            return authResult; // Return authentication error
        }
        const { admin } = authResult;

        // Rate limiting for uploads
        const clientIP = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const rateLimit = checkRateLimit(`upload:${clientIP}`, 10, 15 * 60 * 1000); // 10 uploads per 15 minutes
        
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ 
                    error: 'Too many upload attempts. Please try again later.',
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

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return new Response(
                JSON.stringify({ error: 'No file uploaded' }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Comprehensive file validation
        const validation = validateFile(file);
        if (!validation.valid) {
            return new Response(
                JSON.stringify({ 
                    error: 'File validation failed', 
                    details: validation.errors 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Additional file content validation
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Check file signatures (magic bytes) to prevent file type spoofing
        const isValidImage = validateFileSignature(buffer, file.type);
        if (!isValidImage) {
            return new Response(
                JSON.stringify({ error: 'Invalid file content. File type does not match content.' }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Generate secure filename
        const timestamp = Date.now();
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const fileExtension = getSecureExtension(file.type);
        const adminId = admin.id.toString().padStart(4, '0'); // Include admin ID for tracking
        const fileName = `${adminId}_${timestamp}_${randomBytes}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // Prevent directory traversal
        if (!filePath.startsWith(uploadsDir)) {
            return new Response(
                JSON.stringify({ error: 'Invalid file path' }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Save file with restricted permissions
        await writeFile(filePath, buffer, { mode: 0o644 });
        
        // Log upload for audit trail
        console.log(`File uploaded: ${fileName} by admin ${admin.email} (ID: ${admin.id})`);

        // Return the public URL
        const publicUrl = `/uploads/products/${fileName}`;

        return new Response(
            JSON.stringify({
                success: true,
                url: publicUrl,
                filename: fileName,
                size: file.size,
                type: file.type,
                uploadedAt: new Date().toISOString(),
                uploadedBy: admin.id
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );

    } catch (error) {
        console.error('Upload error:', error.message);
        
        // Don't expose internal error details
        return new Response(
            JSON.stringify({ error: 'File upload service temporarily unavailable' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    }
}

// File signature validation to prevent file type spoofing
function validateFileSignature(buffer, mimeType) {
    const signatures = {
        'image/jpeg': [0xFF, 0xD8, 0xFF],
        'image/jpg': [0xFF, 0xD8, 0xFF],
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF
    };
    
    const signature = signatures[mimeType];
    if (!signature) return false;
    
    for (let i = 0; i < signature.length; i++) {
        if (buffer[i] !== signature[i]) {
            // Special case for WEBP - check for WEBP signature at offset 8
            if (mimeType === 'image/webp' && i === 0) {
                const webpSig = [0x57, 0x45, 0x42, 0x50]; // WEBP
                for (let j = 0; j < webpSig.length; j++) {
                    if (buffer[8 + j] !== webpSig[j]) return false;
                }
                return true;
            }
            return false;
        }
    }
    return true;
}

// Get secure file extension based on MIME type
function getSecureExtension(mimeType) {
    const extensions = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp'
    };
    return extensions[mimeType] || '.bin';
}