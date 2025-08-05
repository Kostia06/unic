"use client";
import { useTranslation } from "@/lib/translation-context";
import { Sparkles, Gem, Filter, Grid, List } from "lucide-react";
import SimpleProductCard from "../SimpleProductCard";
import { useState } from "react";

export default function SimpleProductGrid({ products = [] }) {
    const { t, language } = useTranslation();
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category?.toLowerCase() === filter.toLowerCase());

    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <section id="collection" className="container-luxury section-padding py-24 bg-gradient-to-b from-white to-stone-50">
            {/* Header */}
            <div className="text-center mb-20">
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Gem size={40} className="text-luxury-champagne-500" />
                            <div className="absolute -top-1 -right-1 animate-pulse">
                                <Sparkles size={16} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="subheading-luxury mb-6">
                        {language === 'es' ? 'Colección Exclusiva' : 'Exclusive Collection'}
                    </h2>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-lg md:text-xl max-w-3xl mx-auto">
                        {language === 'es' 
                            ? 'Cada pieza de nuestra colección es una obra maestra única, creada con la más fina artesanía y materiales excepcionales. Descubre la belleza que trasciende el tiempo.'
                            : 'Each piece in our collection is a unique masterpiece, crafted with the finest artisanship and exceptional materials. Discover beauty that transcends time.'
                        }
                    </p>
                </div>

                {/* Filter and View Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 max-w-4xl mx-auto">
                    {/* Category Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-stone-500" />
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                        filter === category
                                            ? 'bg-luxury-champagne-600 text-white shadow-luxury'
                                            : 'bg-white text-stone-600 hover:bg-luxury-champagne-50 border border-stone-200'
                                    }`}
                                >
                                    {category === 'all' 
                                        ? (language === 'es' ? 'Todos' : 'All')
                                        : category
                                    }
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2 bg-white rounded-full p-1 border border-stone-200 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-full transition-all duration-300 ${
                                viewMode === 'grid'
                                    ? 'bg-luxury-champagne-600 text-white shadow-lg'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-full transition-all duration-300 ${
                                viewMode === 'list'
                                    ? 'bg-luxury-champagne-600 text-white shadow-lg'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <Gem size={48} className="text-stone-300 mx-auto mb-6" />
                        <p className="text-stone-500 text-lg mb-4">
                            {t('products.no_products')}
                        </p>
                        <p className="text-stone-400 text-sm">
                            {language === 'es' 
                                ? 'Pronto agregaremos nuevas piezas exclusivas a nuestra colección.'
                                : 'We will be adding new exclusive pieces to our collection soon.'
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className={`grid gap-8 ${
                    viewMode === 'grid'
                        ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1 lg:grid-cols-2'
                }`}>
                    {filteredProducts.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <SimpleProductCard {...product} viewMode={viewMode} />
                        </div>
                    ))}
                </div>
            )}

            {/* Collection Stats */}
            {filteredProducts.length > 0 && (
                <div className="text-center mt-16 pt-16 border-t border-stone-200">
                    <p className="text-stone-500 text-sm">
                        {language === 'es' 
                            ? `Mostrando ${filteredProducts.length} de ${products.length} piezas exclusivas`
                            : `Showing ${filteredProducts.length} of ${products.length} exclusive pieces`
                        }
                    </p>
                </div>
            )}
        </section>
    );
}