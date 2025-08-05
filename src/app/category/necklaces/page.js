"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translation-context";
import SimpleProductGrid from "@/components/SimpleProductGrid";
import { Sparkles } from "lucide-react";

export default function NecklacesPage() {
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
                const necklaceProducts = data.filter(product => 
                    product.category?.toLowerCase() === 'necklaces'
                );
                setProducts(necklaceProducts);
            } else {
                // Fallback to mock necklace products
                const mockNecklaces = [
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
                        id: 5,
                        name: language === 'es' ? "Colgante de Perla" : "Pearl Pendant",
                        price: 1200,
                        image: "/api/placeholder/400/500",
                        category: "Necklaces",
                        stoneColor: "pearl",
                        numberOfRings: 0,
                        description: language === 'es' 
                            ? "Elegante colgante de perla natural con cadena de oro rosa delicadamente trabajada" 
                            : "Elegant natural pearl pendant with delicately crafted rose gold chain"
                    }
                ];
                setProducts(mockNecklaces);
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
                            <div className="text-6xl mb-4">✨</div>
                            <div className="absolute -top-2 -right-2 animate-pulse">
                                <Sparkles size={20} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="heading-luxury mb-6">
                        {language === 'es' ? 'Collares Exquisitos' : 'Exquisite Necklaces'}
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-xl max-w-4xl mx-auto">
                        {language === 'es'
                            ? 'Descubre nuestra colección de collares que combinan la tradición artesanal mexicana con diseños contemporáneos de lujo internacional.'
                            : 'Discover our collection of necklaces that combine Mexican artisanal tradition with contemporary international luxury designs.'
                        }
                    </p>
                </div>
            </section>

            <SimpleProductGrid products={products} />
        </div>
    );
}