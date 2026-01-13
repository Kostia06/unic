-- Fam Unic Database Schema
-- Initial migration for all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Products Table
-- =============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name_es VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_es TEXT,
    description_en TEXT,
    category VARCHAR(100) NOT NULL,
    base_price_mxn DECIMAL(10, 2) NOT NULL,
    base_price_usd DECIMAL(10, 2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    has_variants BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering and sorting
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = TRUE;

-- =============================================
-- Product Images Table
-- =============================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying images by product
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =============================================
-- Variant Types Table (e.g., "Material", "Size", "Color")
-- =============================================
CREATE TABLE variant_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name_es VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_variant_types_product ON variant_types(product_id);

-- =============================================
-- Variant Options Table (e.g., "Plata 925", "Oro 14k")
-- =============================================
CREATE TABLE variant_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_type_id UUID NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
    name_es VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    color_hex VARCHAR(7), -- For color swatches
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_variant_options_type ON variant_options(variant_type_id);

-- =============================================
-- Product Variants Table
-- =============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    price_mxn DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    options JSONB NOT NULL DEFAULT '{}', -- e.g., {"material": "plata-925", "size": "mediano"}
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- =============================================
-- Orders Table
-- =============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address JSONB NOT NULL, -- {"street", "city", "state", "postal_code", "country"}
    billing_address JSONB,
    items JSONB NOT NULL, -- Array of {product_id, variant_id, name, quantity, price}
    subtotal_mxn DECIMAL(10, 2) NOT NULL,
    tax_mxn DECIMAL(10, 2) DEFAULT 0,
    shipping_mxn DECIMAL(10, 2) DEFAULT 0,
    total_mxn DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- unfulfilled, processing, shipped, delivered, cancelled
    stripe_payment_intent_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    tracking_number VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for order queries
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =============================================
-- Contact Messages Table
-- =============================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- =============================================
-- Testimonials Table
-- =============================================
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content_es TEXT NOT NULL,
    content_en TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured) WHERE is_featured = TRUE;

-- =============================================
-- FAQs Table
-- =============================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_es TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_es TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faqs_is_active ON faqs(is_active) WHERE is_active = TRUE;

-- =============================================
-- Admin Users Table
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin', -- admin, super_admin
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- Updated At Trigger Function
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products table
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to orders table
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Products are editable by admins" ON products
    FOR ALL USING (is_admin());

-- Product Images: Public read, admin write
CREATE POLICY "Product images are viewable by everyone" ON product_images
    FOR SELECT USING (TRUE);

CREATE POLICY "Product images are editable by admins" ON product_images
    FOR ALL USING (is_admin());

-- Variant Types: Public read, admin write
CREATE POLICY "Variant types are viewable by everyone" ON variant_types
    FOR SELECT USING (TRUE);

CREATE POLICY "Variant types are editable by admins" ON variant_types
    FOR ALL USING (is_admin());

-- Variant Options: Public read, admin write
CREATE POLICY "Variant options are viewable by everyone" ON variant_options
    FOR SELECT USING (TRUE);

CREATE POLICY "Variant options are editable by admins" ON variant_options
    FOR ALL USING (is_admin());

-- Product Variants: Public read, admin write
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Product variants are editable by admins" ON product_variants
    FOR ALL USING (is_admin());

-- Orders: Users can view their own, admins can view all
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        customer_email = auth.jwt() ->> 'email'
        OR is_admin()
    );

CREATE POLICY "Orders are editable by admins" ON orders
    FOR ALL USING (is_admin());

-- Orders: Allow unauthenticated inserts for checkout
CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (TRUE);

-- Contact Messages: Anyone can insert, admins can read/update
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Contact messages are viewable by admins" ON contact_messages
    FOR SELECT USING (is_admin());

CREATE POLICY "Contact messages are editable by admins" ON contact_messages
    FOR UPDATE USING (is_admin());

-- Testimonials: Public read, admin write
CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
    FOR SELECT USING (TRUE);

CREATE POLICY "Testimonials are editable by admins" ON testimonials
    FOR ALL USING (is_admin());

-- FAQs: Public read, admin write
CREATE POLICY "FAQs are viewable by everyone" ON faqs
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "FAQs are editable by admins" ON faqs
    FOR ALL USING (is_admin());

-- Admin Users: Only super admins can manage, admins can view
CREATE POLICY "Admins can view admin users" ON admin_users
    FOR SELECT USING (is_admin());

CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );
