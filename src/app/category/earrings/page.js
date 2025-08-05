"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translation-context";
import SimpleProductGrid from "@/components/SimpleProductGrid";
import { Sparkles } from "lucide-react";

export default function EarringsPage() {
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
                const earringProducts = data.filter(product => 
                    product.category?.toLowerCase() === 'earrings'
                );
                setProducts(earringProducts);
            } else {
                // Fallback to mock earring products
                const mockEarrings = [
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
                    }
                ];
                setProducts(mockEarrings);
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
                            <div className="text-6xl mb-4">💎</div>
                            <div className="absolute -top-2 -right-2 animate-pulse">
                                <Sparkles size={20} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="heading-luxury mb-6">
                        {language === 'es' ? 'Aretes Deslumbrantes' : 'Dazzling Earrings'}
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-xl max-w-4xl mx-auto">
                        {language === 'es'
                            ? 'Ilumina tu rostro con nuestros aretes excepcionales, cada par diseñado para realzar tu belleza natural con un brillo incomparable.'
                            : 'Illuminate your face with our exceptional earrings, each pair designed to enhance your natural beauty with incomparable brilliance.'
                        }
                    </p>
                </div>
            </section>

            <SimpleProductGrid products={products} />
        </div>
    );
}