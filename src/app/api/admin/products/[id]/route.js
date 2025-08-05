import { PrismaClient } from '../../../../../generated/prisma';
import { requireAdminAuth, checkRateLimit } from '../../../../../lib/auth-middleware.js';
import { 
    SECURITY_HEADERS, 
    VALIDATION_PATTERNS,
    validateInput,
    sanitizeString
} from '../../../../../lib/security.js';

const prisma = new PrismaClient();

// Validate product ID parameter
function validateProductId(id) {
    const productId = parseInt(id);
    if (isNaN(productId) || productId <= 0 || productId > 2147483647) {
        return { valid: false, error: 'Invalid product ID' };
    }
    return { valid: true, id: productId };
}

// Input validation for product data (reused from products/route.js)
function validateProductData(data) {
    const errors = [];
    
    if (!data.name || typeof data.name !== 'string') {
        errors.push('Product name is required');
    } else if (!validateInput(data.name, VALIDATION_PATTERNS.PRODUCT_NAME)) {
        errors.push('Invalid product name format');
    }
    
    if (!data.price || isNaN(parseFloat(data.price))) {
        errors.push('Valid price is required');
    } else if (!validateInput(data.price.toString(), VALIDATION_PATTERNS.PRICE)) {
        errors.push('Invalid price format');
    }
    
    if (!data.category || typeof data.category !== 'string') {
        errors.push('Category is required');
    }
    
    if (data.description && typeof data.description !== 'string') {
        errors.push('Description must be a string');
    }
    
    if (data.numberOfRings && (isNaN(parseInt(data.numberOfRings)) || parseInt(data.numberOfRings) < 0 || parseInt(data.numberOfRings) > 10)) {
        errors.push('Number of rings must be between 0 and 10');
    }
    
    if (data.images && !Array.isArray(data.images)) {
        errors.push('Images must be an array');
    }
    
    if (data.availableRingSizes && !Array.isArray(data.availableRingSizes)) {
        errors.push('Available ring sizes must be an array');
    } else if (data.availableRingSizes) {
        const validSizes = [1, 2, 3];
        const invalidSizes = data.availableRingSizes.filter(size => !validSizes.includes(parseInt(size)));
        if (invalidSizes.length > 0) {
            errors.push('Invalid ring sizes. Only 1, 2, and 3 are allowed');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// Sanitize product data
function sanitizeProductData(data) {
    return {
        name: sanitizeString(data.name, 100),
        price: parseFloat(data.price),
        description: data.description ? sanitizeString(data.description, 1000) : null,
        category: sanitizeString(data.category, 50),
        stoneColor: data.stoneColor ? sanitizeString(data.stoneColor, 50) : null,
        numberOfRings: data.numberOfRings ? parseInt(data.numberOfRings) : 0,
        image: data.image ? sanitizeString(data.image, 500) : null,
        images: Array.isArray(data.images) ? data.images.map(img => sanitizeString(img, 500)).filter(Boolean) : [],
        availableRingSizes: Array.isArray(data.availableRingSizes) ? 
            data.availableRingSizes.map(size => parseInt(size)).filter(size => [1, 2, 3].includes(size)) : [1],
        inStock: Boolean(data.inStock)
    };
}

export async function PUT(request, { params }) {
    try {
        // Authenticate admin user
        const authResult = await requireAdminAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }
        const { admin } = authResult;
        
        // Rate limiting
        const clientIP = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const rateLimit = checkRateLimit(`update:${clientIP}`, 30, 15 * 60 * 1000);
        
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many update attempts. Please try again later.' }),
                { 
                    status: 429,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Validate product ID
        const idValidation = validateProductId(params.id);
        if (!idValidation.valid) {
            return new Response(
                JSON.stringify({ error: idValidation.error }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        const id = idValidation.id;
        
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            select: { id: true, name: true }
        });
        
        if (!existingProduct) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        
        const rawData = await request.json();
        
        // Validate input data
        const validation = validateProductData(rawData);
        if (!validation.valid) {
            return new Response(
                JSON.stringify({ 
                    error: 'Validation failed', 
                    details: validation.errors 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        
        // Sanitize data
        const data = sanitizeProductData(rawData);
        
        // Update product
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
                // updatedBy: admin.id // Add if you have this field
            }
        });
        
        // Log update for audit
        console.log(`Product updated: ${product.id} by admin ${admin.email}`);

        return new Response(
            JSON.stringify(product),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } catch (error) {
        console.error('Error updating product:', error.message);
        
        if (error.code === 'P2025') {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        
        return new Response(
            JSON.stringify({ error: 'Failed to update product' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request, { params }) {
    try {
        // Authenticate admin user
        const authResult = await requireAdminAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }
        const { admin } = authResult;
        
        // Rate limiting for deletion (more restrictive)
        const clientIP = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const rateLimit = checkRateLimit(`delete:${clientIP}`, 10, 15 * 60 * 1000); // 10 deletes per 15 minutes
        
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many deletion attempts. Please try again later.' }),
                { 
                    status: 429,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Validate product ID
        const idValidation = validateProductId(params.id);
        if (!idValidation.valid) {
            return new Response(
                JSON.stringify({ error: idValidation.error }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        const id = idValidation.id;
        
        // Check if product exists and get its details for audit
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            select: { id: true, name: true }
        });
        
        if (!existingProduct) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        
        // Delete product
        await prisma.product.delete({
            where: { id }
        });
        
        // Log deletion for audit
        console.log(`Product deleted: ${existingProduct.id} (${existingProduct.name}) by admin ${admin.email}`);

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: 'Product deleted successfully',
                deletedProduct: {
                    id: existingProduct.id,
                    name: existingProduct.name
                }
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } catch (error) {
        console.error('Error deleting product:', error.message);
        
        if (error.code === 'P2025') {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        
        return new Response(
            JSON.stringify({ error: 'Failed to delete product' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}