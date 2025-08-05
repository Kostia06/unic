"use client";
import { useState, useEffect } from "react";
import SimpleHero from "@/components/SimpleHero";
import SimpleProductGrid from "@/components/SimpleProductGrid";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useTranslation } from "@/lib/translation-context";
import { STONE_COLORS, JEWELRY_CATEGORIES } from "@/lib/types";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const { t, language } = useTranslation();

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
                // Fallback to mock data if API fails
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
                        name: language === 'es' ? "Anillo de Zafiro Triple" : "Triple Sapphire Ring",
                        price: 2800,
                        image: "/api/placeholder/400/500",
                        category: "Rings",
                        stoneColor: "sapphire",
                        numberOfRings: 3,
                        description: language === 'es' 
                            ? "Exquisito anillo con tres zafiros perfectamente alineados en oro blanco premium" 
                            : "Exquisite ring with three perfectly aligned sapphires in premium white gold"
                    },
                    {
                        id: 5,
                        name: language === 'es' ? "Colgante de Perla" : "Pearl Pendant",
                        price: 1200,
                        image: "/api/placeholder/400/500",
                        category: "Pendants",
                        stoneColor: "pearl",
                        numberOfRings: 0,
                        description: language === 'es' 
                            ? "Elegante colgante de perla natural con cadena de oro rosa delicadamente trabajada" 
                            : "Elegant natural pearl pendant with delicately crafted rose gold chain"
                    },
                    {
                        id: 6,
                        name: language === 'es' ? "Conjunto de Amatista" : "Amethyst Set",
                        price: 2200,
                        image: "/api/placeholder/400/500",
                        category: "Sets",
                        stoneColor: "amethyst",
                        numberOfRings: 2,
                        description: language === 'es' 
                            ? "Conjunto exclusivo de amatista con collar y aretes que irradian sofisticación" 
                            : "Exclusive amethyst set with necklace and earrings that radiate sophistication"
                    }
                ];
                setProducts(mockProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to empty array but with a basic structure for demo
            setProducts([]);
        }
    };

    return (
        <div>
            <SimpleHero />
            <SimpleProductGrid products={products} />
            <FeaturesSection />
            <TestimonialsSection />
        </div>
    );
}
