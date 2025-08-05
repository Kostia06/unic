"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { Sparkles, Gem, Filter, Grid, List } from "lucide-react";
import ProductCard from "../ProductCard";
import { useState } from "react";

export default function ProductGrid({ products = [] }) {
    const { t, language } = useTranslation();
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
    };

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category?.toLowerCase() === filter.toLowerCase());

    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <section id="collection" className="container-luxury section-padding py-24 bg-gradient-to-b from-white to-stone-50">
            {/* Header */}
            <div className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Gem size={40} className="text-luxury-champagne-500" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-1 -right-1"
                            >
                                <Sparkles size={16} className="text-luxury-gold-400" />
                            </motion.div>
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
                </motion.div>

                {/* Filter and View Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 max-w-4xl mx-auto"
                >
                    {/* Category Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-stone-500" />
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <motion.button
                                    key={category}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilter(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        filter === category
                                            ? 'bg-luxury-champagne-600 text-white shadow-luxury'
                                            : 'bg-white text-stone-600 hover:bg-luxury-champagne-50 border border-stone-200'
                                    }`}
                                >
                                    {category === 'all' 
                                        ? (language === 'es' ? 'Todos' : 'All')
                                        : category
                                    }
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2 bg-white rounded-full p-1 border border-stone-200 shadow-sm">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-full transition-all duration-300 ${
                                viewMode === 'grid'
                                    ? 'bg-luxury-champagne-600 text-white shadow-lg'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            <Grid size={16} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-full transition-all duration-300 ${
                                viewMode === 'list'
                                    ? 'bg-luxury-champagne-600 text-white shadow-lg'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            <List size={16} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
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
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={`grid gap-8 ${
                        viewMode === 'grid'
                            ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1 lg:grid-cols-2'
                    }`}
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div 
                            key={product.id} 
                            variants={item}
                            custom={index}
                        >
                            <ProductCard {...product} viewMode={viewMode} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Collection Stats */}
            {filteredProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16 pt-16 border-t border-stone-200"
                >
                    <p className="text-stone-500 text-sm">
                        {language === 'es' 
                            ? `Mostrando ${filteredProducts.length} de ${products.length} piezas exclusivas`
                            : `Showing ${filteredProducts.length} of ${products.length} exclusive pieces`
                        }
                    </p>
                </motion.div>
            )}
        </section>
    );
}
