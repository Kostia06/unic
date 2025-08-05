import { PrismaClient } from '../../../../generated/prisma';
import { requireAdminAuth, checkRateLimit } from '../../../../lib/auth-middleware.js';
import { 
    SECURITY_HEADERS, 
    VALIDATION_PATTERNS,
    validateInput,
    sanitizeString
} from '../../../../lib/security.js';

const prisma = new PrismaClient();

// Input validation for product data
function validateProductData(data) {
    const errors = [];
    
    // Validate required fields
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
    
    // Validate optional fields
    if (data.description && typeof data.description !== 'string') {
        errors.push('Description must be a string');
    }
    
    if (data.numberOfRings && (isNaN(parseInt(data.numberOfRings)) || parseInt(data.numberOfRings) < 0 || parseInt(data.numberOfRings) > 10)) {
        errors.push('Number of rings must be between 0 and 10');
    }
    
    // Validate arrays
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

export async function GET(request) {
    try {
        // Authenticate admin user
        const authResult = await requireAdminAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }
        
        // Rate limiting
        const clientIP = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const rateLimit = checkRateLimit(`api:${clientIP}`, 100, 15 * 60 * 1000);
        
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                { 
                    status: 429,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }

        // Fetch products with limited fields for security
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                images: true,
                category: true,
                stoneColor: true,
                numberOfRings: true,
                availableRingSizes: true,
                description: true,
                inStock: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1000 // Limit results to prevent excessive data transfer
        });

        return new Response(
            JSON.stringify(products),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch products' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request) {
    try {
        // Authenticate admin user
        const authResult = await requireAdminAuth(request);
        if (authResult instanceof Response) {
            return authResult;
        }
        const { admin } = authResult;
        
        // Rate limiting for creation
        const clientIP = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const rateLimit = checkRateLimit(`create:${clientIP}`, 20, 15 * 60 * 1000); // 20 creates per 15 minutes
        
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many creation attempts. Please try again later.' }),
                { 
                    status: 429,
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
        
        // Create product with audit trail
        const product = await prisma.product.create({
            data: {
                ...data,
                // Add audit fields if they exist in your schema
                // createdBy: admin.id,
                // updatedBy: admin.id
            }
        });
        
        // Log creation for audit
        console.log(`Product created: ${product.id} by admin ${admin.email}`);

        return new Response(
            JSON.stringify(product),
            { 
                status: 201,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } catch (error) {
        console.error('Error creating product:', error.message);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return new Response(
                JSON.stringify({ error: 'Product with this name already exists' }),
                { 
                    status: 409,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                }
            );
        }
        
        return new Response(
            JSON.stringify({ error: 'Failed to create product' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}