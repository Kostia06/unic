"use client";
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/translation-context';
import { useAdminAuth } from '@/lib/admin-auth';
import { Crown, Sparkles, Package, Plus } from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import ProductsTable from '@/components/admin/ProductsTable';

export default function AdminDashboard() {
    const { t, language } = useTranslation();
    const { admin } = useAdminAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        categories: 0,
        inStock: 0,
        outOfStock: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                
                // Calculate stats
                const categories = new Set(data.map(p => p.category)).size;
                const inStock = data.filter(p => p.inStock !== false).length;
                const outOfStock = data.length - inStock;
                
                setStats({
                    totalProducts: data.length,
                    categories,
                    inStock,
                    outOfStock
                });
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <AdminNavbar />
            
            <div className="container-luxury section-padding py-8">
                <div className="animate-fade-in-up">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="flex items-center space-x-3 mr-6">
                                <Crown size={32} className="text-luxury-champagne-600" />
                                <div className="relative">
                                    <Sparkles size={16} className="text-luxury-gold-400 absolute -top-1 -right-1 animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h1 className="heading-luxury">
                                    {language === 'es' ? 'Panel de Administración' : 'Admin Dashboard'}
                                </h1>
                                <p className="text-elegant mt-2">
                                    {language === 'es' ? 'Bienvenido' : 'Welcome'}, {admin?.name || admin?.email}
                                </p>
                            </div>
                        </div>
                        <div className="divider-luxury-wide" />
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="card-luxury p-6 text-center hover:shadow-luxury transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-luxury-champagne-100">
                                    <Package size={24} className="text-luxury-champagne-600" />
                                </div>
                            </div>
                            <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">
                                {stats.totalProducts}
                            </h3>
                            <p className="text-stone-500 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'Total Productos' : 'Total Products'}
                            </p>
                        </div>

                        <div className="card-luxury p-6 text-center hover:shadow-luxury transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Sparkles size={24} className="text-blue-600" />
                                </div>
                            </div>
                            <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">
                                {stats.categories}
                            </h3>
                            <p className="text-stone-500 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'Categorías' : 'Categories'}
                            </p>
                        </div>

                        <div className="card-luxury p-6 text-center hover:shadow-luxury transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-green-100">
                                    <div className="w-6 h-6 bg-green-600 rounded-full" />
                                </div>
                            </div>
                            <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">
                                {stats.inStock}
                            </h3>
                            <p className="text-stone-500 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'En Stock' : 'In Stock'}
                            </p>
                        </div>

                        <div className="card-luxury p-6 text-center hover:shadow-luxury transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-red-100">
                                    <div className="w-6 h-6 bg-red-600 rounded-full" />
                                </div>
                            </div>
                            <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">
                                {stats.outOfStock}
                            </h3>
                            <p className="text-stone-500 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'Agotado' : 'Out of Stock'}
                            </p>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="card-luxury">
                        <div className="p-6 border-b border-stone-200">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display text-xl font-semibold text-stone-800">
                                    {language === 'es' ? 'Gestión de Productos' : 'Product Management'}
                                </h2>
                                <button className="btn-luxury flex items-center space-x-2 hover:scale-105 transition-transform">
                                    <Plus size={16} />
                                    <span>{language === 'es' ? 'Nuevo Producto' : 'New Product'}</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-champagne-600 mx-auto mb-4"></div>
                                        <p className="text-elegant">
                                            {language === 'es' ? 'Cargando productos...' : 'Loading products...'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <ProductsTable 
                                    products={products} 
                                    onUpdate={fetchProducts} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}