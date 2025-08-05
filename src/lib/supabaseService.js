import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                price,
                image,
                category,
                stone_color,
                number_of_rings,
                description,
                details,
                in_stock,
                reviews,
                review_count,
                created_at
            `)
            .eq('in_stock', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const fetchProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                price,
                images,
                category,
                stone_color,
                number_of_rings,
                description,
                details,
                in_stock,
                reviews,
                review_count,
                created_at
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

export const fetchProductsByCategory = async (category) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                price,
                image,
                category,
                stone_color,
                number_of_rings,
                description,
                in_stock,
                created_at
            `)
            .eq('category', category)
            .eq('in_stock', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
};

export const searchProducts = async (query) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                price,
                image,
                category,
                stone_color,
                number_of_rings,
                description
            `)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
            .eq('in_stock', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};