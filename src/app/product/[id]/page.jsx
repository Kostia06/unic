"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/translation-context";
import { ArrowLeft, ShoppingBag, Heart, Share2, Sparkles, Star, Crown } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
    const { id } = useParams();
    const { language } = useTranslation();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id, language]);

    const fetchProduct = async () => {
        setIsLoading(true);
        
        try {
            const response = await fetch(`/api/admin/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            } else {
                // Fallback to mock data
                const mockProducts = [
                    {
                        id: 1,
                        name: language === 'es' ? "Anillo de Rubí Solitario" : "Ruby Solitaire Ring",
                        price: 2500,
                        images: ["/api/placeholder/600/600", "/api/placeholder/600/600", "/api/placeholder/600/600"],
                        category: "Rings",
                        stoneColor: "ruby",
                        numberOfRings: 1,
                        description: language === 'es'
                            ? "Elegante anillo de rubí con engaste de oro premium que captura la luz de manera excepcional. Esta impresionante pieza presenta una gema de rubí cuidadosamente seleccionada en un engaste clásico solitario, perfecto para compromisos u ocasiones especiales."
                            : "Elegant ruby solitaire ring with premium gold setting that captures light exceptionally. This stunning piece features a carefully selected ruby gemstone in a classic solitaire setting, perfect for engagements or special occasions.",
                        details: {
                            material: language === 'es' ? "Oro 14k" : "14k Gold",
                            gemstone: language === 'es' ? "Rubí Natural" : "Natural Ruby",
                            caratWeight: "1.5ct",
                            setting: language === 'es' ? "Engaste de Garra" : "Prong Setting",
                            ringSize: language === 'es' ? "Ajustable" : "Adjustable"
                        },
                        inStock: true,
                        reviews: 4.8,
                        reviewCount: 24
                    },
                    {
                        id: 2,
                        name: language === 'es' ? "Collar de Esmeralda" : "Emerald Necklace",
                        price: 3200,
                        images: ["/api/placeholder/600/600", "/api/placeholder/600/600"],
                        category: "Necklaces",
                        stoneColor: "emerald",
                        numberOfRings: 0,
                        description: language === 'es'
                            ? "Impresionante collar de esmeralda con colgante artesanal elaborado con precisión y cuidado. Presenta una magnífica esmeralda central rodeada de delicado trabajo en oro."
                            : "Stunning emerald pendant necklace crafted with precision and care. Features a magnificent emerald centerpiece surrounded by delicate gold work.",
                        details: {
                            material: language === 'es' ? "Oro 18k" : "18k Gold",
                            gemstone: language === 'es' ? "Esmeralda Natural" : "Natural Emerald",
                            chainLength: language === 'es' ? "45 cm" : "18 inches",
                            pendantSize: "12mm x 8mm",
                            clasp: language === 'es' ? "Broche de Resorte" : "Spring Ring"
                        },
                        inStock: true,
                        reviews: 4.9,
                        reviewCount: 18
                    }
                ];

                const foundProduct = mockProducts.find(p => p.id === parseInt(id));
                setProduct(foundProduct);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setProduct(null);
        }
        
        setIsLoading(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
            style: 'currency',
            currency: language === 'es' ? 'MXN' : 'USD'
        }).format(price);
    };

    const getStoneColorClass = (stoneColor) => {
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
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-champagne-600 mx-auto mb-4"></div>
                    <p className="text-elegant">
                        {language === 'es' ? 'Cargando...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-white">
                <div className="text-center">
                    <Crown size={48} className="text-stone-300 mx-auto mb-6" />
                    <h1 className="subheading-luxury mb-4">
                        {language === 'es' ? 'Producto No Encontrado' : 'Product Not Found'}
                    </h1>
                    <p className="text-elegant mb-8">
                        {language === 'es' 
                            ? 'Lo sentimos, no pudimos encontrar el producto que buscas.'
                            : 'Sorry, we could not find the product you are looking for.'
                        }
                    </p>
                    <Link href="/" className="btn-luxury hover:scale-105 transition-transform">
                        {language === 'es' ? 'Volver al Inicio' : 'Return to Home'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            <div className="container-luxury section-padding py-8">
                <Link 
                    href="/"
                    className="inline-flex items-center text-stone-600 hover:text-luxury-champagne-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {language === 'es' ? 'Volver a la Colección' : 'Back to Collection'}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Product Images */}
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="aspect-square overflow-hidden card-luxury group">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        
                        {product.images.length > 1 && (
                            <div className="flex space-x-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                                            selectedImage === index
                                                ? 'border-luxury-champagne-600 shadow-luxury'
                                                : 'border-stone-200 hover:border-luxury-champagne-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-luxury-champagne-100 text-luxury-champagne-700">
                                    <Sparkles size={12} className="mr-1" />
                                    {product.category}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className="p-3 rounded-full bg-white shadow-lg hover:shadow-luxury transition-all hover:scale-110"
                                    >
                                        <Heart className={`w-5 h-5 transition-colors ${
                                            isWishlisted ? 'text-red-500 fill-red-500' : 'text-stone-400 hover:text-red-500'
                                        }`} />
                                    </button>
                                    <button className="p-3 rounded-full bg-white shadow-lg hover:shadow-luxury transition-all hover:scale-110">
                                        <Share2 className="w-5 h-5 text-stone-400 hover:text-stone-600" />
                                    </button>
                                </div>
                            </div>
                            
                            <h1 className="heading-luxury mb-6">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center space-x-6 mb-6">
                                <p className="font-display text-4xl font-bold text-luxury-champagne-700">
                                    {formatPrice(product.price)}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <div className="flex text-luxury-gold-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16}
                                                className={i < Math.floor(product.reviews) ? 'fill-current' : ''}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-stone-500">
                                        ({product.reviewCount} {language === 'es' ? 'reseñas' : 'reviews'})
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 mb-8">
                                {product.numberOfRings > 0 && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-100 text-stone-700">
                                        <Sparkles size={12} className="mr-1" />
                                        {product.numberOfRings} {product.numberOfRings === 1 ? 'ring' : 'rings'}
                                    </span>
                                )}
                                <div className="flex items-center space-x-3">
                                    <div 
                                        className={`w-5 h-5 rounded-full border-2 border-white shadow-sm ${getStoneColorClass(product.stoneColor)}`}
                                    />
                                    <span className="text-sm text-stone-600 capitalize font-medium">
                                        {product.stoneColor} {language === 'es' ? 'piedra' : 'stone'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-display text-xl font-semibold text-stone-800 mb-4">
                                {language === 'es' ? 'Descripción' : 'Description'}
                            </h3>
                            <p className="text-elegant leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Details */}
                        <div>
                            <h3 className="font-display text-xl font-semibold text-stone-800 mb-4">
                                {language === 'es' ? 'Detalles' : 'Details'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(product.details).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center py-2 border-b border-stone-100">
                                        <span className="text-stone-500 capitalize text-sm">
                                            {key.replace(/([A-Z])/g, ' $1')}:
                                        </span>
                                        <span className="text-stone-700 font-medium text-sm">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Purchase Section */}
                        <div className="bg-white p-6 card-luxury">
                            <div className="flex items-center space-x-6 mb-6">
                                <div className="flex items-center space-x-3">
                                    <label htmlFor="quantity" className="text-sm font-medium text-stone-700">
                                        {language === 'es' ? 'Cantidad:' : 'Quantity:'}
                                    </label>
                                    <select
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-champagne-500 focus:border-luxury-champagne-500"
                                    >
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="flex-1">
                                    <span className="text-xs text-stone-500 uppercase tracking-wide">
                                        {product.inStock 
                                            ? (language === 'es' ? 'En Stock' : 'In Stock')
                                            : (language === 'es' ? 'Agotado' : 'Out of Stock')
                                        }
                                    </span>
                                </div>
                            </div>
                            
                            <button
                                className="w-full btn-luxury flex items-center justify-center space-x-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!product.inStock}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span>
                                    {product.inStock 
                                        ? (language === 'es' ? 'Agregar al Carrito' : 'Add to Cart')
                                        : (language === 'es' ? 'Producto Agotado' : 'Out of Stock')
                                    }
                                </span>
                            </button>

                            {!product.inStock && (
                                <p className="text-red-600 text-sm mt-4 text-center">
                                    {language === 'es'
                                        ? 'Este artículo está actualmente agotado. Por favor, verifica más tarde.'
                                        : 'This item is currently out of stock. Please check back later.'
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}