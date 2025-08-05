"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translation-context";
import SimpleProductGrid from "@/components/SimpleProductGrid";
import { Crown, Sparkles } from "lucide-react";

export default function RingsPage() {
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
                const ringsProducts = data.filter(product => 
                    product.category?.toLowerCase() === 'rings'
                );
                setProducts(ringsProducts);
            } else {
                // Fallback to mock ring products
                const mockRings = [
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
                        id: 4,
                        name: language === 'es' ? "Anillo de Zafiro Triple" : "Triple Sapphire Ring",
                        price: 2800,
                        image: "/api/placeholder/400/500",
                        category: "Rings",
                        stoneColor: "sapphire",
                        numberOfRings: 3,
                        description: language === 'es' 
                            ? "Exquisito anillo con tres zafiros perfectamente alineados en oro blanco premium" 
                            : "Exquisite ring with three perfectly aligned sapphires in premium white gold"
                    }
                ];
                setProducts(mockRings);
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
                            <div className="text-6xl mb-4">💍</div>
                            <div className="absolute -top-2 -right-2 animate-pulse">
                                <Sparkles size={20} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="heading-luxury mb-6">
                        {language === 'es' ? 'Anillos Exclusivos' : 'Exclusive Rings'}
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-xl max-w-4xl mx-auto">
                        {language === 'es'
                            ? 'Cada anillo es una obra maestra única, diseñada para celebrar los momentos más importantes de tu vida con elegancia y sofisticación incomparables.'
                            : 'Each ring is a unique masterpiece, designed to celebrate life\'s most important moments with unparalleled elegance and sophistication.'
                        }
                    </p>
                </div>
            </section>

            <SimpleProductGrid products={products} />
        </div>
    );
}