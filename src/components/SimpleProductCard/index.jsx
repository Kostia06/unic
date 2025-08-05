"use client";
import { useTranslation } from "@/lib/translation-context";
import { Heart, ShoppingBag, Sparkles, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SimpleProductCard({
    id,
    name,
    image,
    price,
    numberOfRings,
    stoneColor,
    category,
    description
}) {
    const { language } = useTranslation();
    const [isWishlisted, setIsWishlisted] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
            style: 'currency',
            currency: language === 'es' ? 'MXN' : 'USD'
        }).format(price);
    };

    return (
        <article className="product-card-luxury group">
            {/* Image Container */}
            <div className="product-image-container">
                <img
                    src={image || '/api/placeholder/400/500'}
                    alt={name}
                    className="product-image-luxury"
                    loading="lazy"
                />
                
                {/* Overlay with Actions */}
                <div className="product-overlay-luxury">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex space-x-3">
                            <Link href={`/product/${id}`}>
                                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors hover:scale-110">
                                    <Eye size={20} className="text-stone-700" />
                                </button>
                            </Link>
                            
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors hover:scale-110"
                            >
                                <Heart 
                                    size={20} 
                                    className={`transition-colors ${
                                        isWishlisted 
                                            ? 'text-red-500 fill-red-500' 
                                            : 'text-stone-700'
                                    }`} 
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 shadow-lg">
                        {category}
                    </span>
                </div>

                {/* Stone Color Indicator */}
                {stoneColor && (
                    <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <div 
                                className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${getStoneColorClass(stoneColor)}`}
                                title={stoneColor}
                            />
                            <span className="text-xs text-stone-600 capitalize font-medium">
                                {stoneColor}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display text-xl font-semibold text-stone-800 group-hover:text-luxury-champagne-600 transition-colors duration-300">
                            {name}
                        </h3>
                        {numberOfRings > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-luxury-champagne-100 text-luxury-champagne-700">
                                <Sparkles size={12} className="mr-1" />
                                {numberOfRings} {numberOfRings === 1 ? 'ring' : 'rings'}
                            </span>
                        )}
                    </div>
                    
                    {description && (
                        <p className="text-elegant text-sm leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="space-y-1">
                        <p className="font-display text-2xl font-bold text-luxury-champagne-700">
                            {formatPrice(price)}
                        </p>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">
                            {language === 'es' ? 'Precio incluye IVA' : 'Price includes tax'}
                        </p>
                    </div>
                    
                    <button className="inline-flex items-center justify-center p-3 bg-luxury-champagne-600 text-white rounded-full shadow-lg hover:bg-luxury-champagne-700 transition-colors group-hover:shadow-luxury hover:scale-105">
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-champagne-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-champagne-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </article>
    );
}

function getStoneColorClass(stoneColor) {
    const colorMap = {
        ruby: 'bg-red-600',
        emerald: 'bg-green-600',
        sapphire: 'bg-blue-600',
        diamond: 'bg-gradient-to-br from-gray-100 to-gray-200',
        topaz: 'bg-yellow-500',
        amethyst: 'bg-purple-600',
        pearl: 'bg-gradient-to-br from-gray-50 to-cream-100',
        opal: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
        turquoise: 'bg-cyan-500',
        onyx: 'bg-black',
        gold: 'bg-luxury-champagne-500',
        rose_gold: 'bg-gradient-to-br from-luxury-bronze-400 to-luxury-bronze-600',
        silver: 'bg-gradient-to-br from-gray-300 to-gray-400'
    };
    return colorMap[stoneColor?.toLowerCase()] || 'bg-stone-400';
}