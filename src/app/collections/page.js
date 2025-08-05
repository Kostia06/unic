"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translation-context";
import SimpleProductGrid from "@/components/SimpleProductGrid";
import { Crown, Sparkles, Gem } from "lucide-react";

export default function CollectionsPage() {
    const [products, setProducts] = useState([]);
    const { language } = useTranslation();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                // Fallback to mock data
                const mockProducts = [
                    {
                        id: 1,
                        name: language === 'es' ? "Anillo de Rubí Solitario" : "Ruby Solitaire Ring",
                        price: 2500,
                        image: "/api/placeholder/400/500",
                        category: "Rings",
                        stoneColor: "ruby",
                        numberOfRings: 1,
                        description: language === 'es' 
                            ? "Elegante anillo de rubí con engaste de oro premium que captura la luz de manera excepcional" 
                            : "Elegant ruby solitaire ring with premium gold setting that captures light exceptionally"
                    },
                    {
                        id: 2,
                        name: language === 'es' ? "Collar de Esmeralda" : "Emerald Necklace",
                        price: 3200,
                        image: "/api/placeholder/400/500",
                        category: "Necklaces",
                        stoneColor: "emerald",
                        numberOfRings: 0,
                        description: language === 'es' 
                            ? "Impresionante collar de esmeralda con colgante artesanal que refleja la tradición mexicana" 
                            : "Stunning emerald pendant necklace with artisanal craftsmanship reflecting Mexican tradition"
                    },
                    {
                        id: 3,
                        name: language === 'es' ? "Aretes de Diamante" : "Diamond Earrings",
                        price: 1800,
                        image: "/api/placeholder/400/500",
                        category: "Earrings",
                        stoneColor: "diamond",
                        numberOfRings: 0,
                        description: language === 'es' 
                            ? "Aretes clásicos de diamante con corte perfecto que brillan con elegancia atemporal" 
                            : "Classic diamond stud earrings with perfect cut that shine with timeless elegance"
                    },
                    {
                        id: 4,
                        name: language === 'es' ? "Pulsera de Oro Rosa" : "Rose Gold Bracelet",
                        price: 1500,
                        image: "/api/placeholder/400/500",
                        category: "Bracelets",
                        stoneColor: "rose_gold",
                        numberOfRings: 0,
                        description: language === 'es' 
                            ? "Delicada pulsera de oro rosa con acabado artesanal mexicano" 
                            : "Delicate rose gold bracelet with Mexican artisanal finish"
                    }
                ];
                setProducts(mockProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-r from-luxury-champagne-50 to-stone-50">
                <div className="container-luxury section-padding text-center">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <Crown size={48} className="text-luxury-champagne-600" />
                            <div className="absolute -top-2 -right-2 animate-pulse">
                                <Sparkles size={20} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="heading-luxury mb-6">
                        {language === 'es' ? 'Nuestras Colecciones' : 'Our Collections'}
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-xl max-w-4xl mx-auto">
                        {language === 'es'
                            ? 'Descubre la artesanía mexicana más fina en cada una de nuestras colecciones exclusivas. Cada pieza cuenta una historia única de elegancia y tradición.'
                            : 'Discover the finest Mexican craftsmanship in each of our exclusive collections. Every piece tells a unique story of elegance and tradition.'
                        }
                    </p>
                </div>
            </section>

            {/* Collection Categories */}
            <section className="py-16">
                <div className="container-luxury section-padding">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            {
                                name: language === 'es' ? 'Anillos' : 'Rings',
                                href: '/category/rings',
                                icon: '💍',
                                description: language === 'es' ? 'Elegancia en cada detalle' : 'Elegance in every detail'
                            },
                            {
                                name: language === 'es' ? 'Collares' : 'Necklaces',
                                href: '/category/necklaces',
                                icon: '✨',
                                description: language === 'es' ? 'Belleza que cautiva' : 'Beauty that captivates'
                            },
                            {
                                name: language === 'es' ? 'Aretes' : 'Earrings',
                                href: '/category/earrings',
                                icon: '💎',
                                description: language === 'es' ? 'Brillo incomparable' : 'Incomparable brilliance'
                            },
                            {
                                name: language === 'es' ? 'Pulseras' : 'Bracelets',
                                href: '/category/bracelets',
                                icon: '👑',
                                description: language === 'es' ? 'Refinamiento puro' : 'Pure refinement'
                            }
                        ].map((category, index) => (
                            <div
                                key={index}
                                className="card-luxury group p-8 text-center hover:shadow-luxury transition-all duration-300 hover:scale-105"
                            >
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h3 className="font-display text-xl font-semibold text-stone-800 mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-elegant text-sm mb-4">
                                    {category.description}
                                </p>
                                <a
                                    href={category.href}
                                    className="inline-flex items-center text-luxury-champagne-600 hover:text-luxury-champagne-700 font-medium text-sm transition-colors"
                                >
                                    {language === 'es' ? 'Ver Colección' : 'View Collection'}
                                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Products */}
            <SimpleProductGrid products={products} />
        </div>
    );
}