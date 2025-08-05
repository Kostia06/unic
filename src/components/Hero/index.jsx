"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { ChevronDown, Sparkles, Crown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const { t, language } = useTranslation();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-cream-50 to-luxury-champagne-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-texture-luxury opacity-30" />
            
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-20 left-10 w-2 h-2 bg-luxury-champagne-400 rounded-full"
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
            />
            <motion.div
                className="absolute top-40 right-20 w-3 h-3 bg-luxury-gold-400 rounded-full"
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.9, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <motion.div
                className="absolute bottom-32 left-20 w-1 h-1 bg-luxury-bronze-400 rounded-full"
                animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            />

            {/* Main Content */}
            <motion.div 
                className="relative z-10 text-center max-w-6xl mx-auto section-padding"
            >
                {/* Crown Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <div className="relative">
                        <Crown size={48} className="text-luxury-champagne-500" />
                        <motion.div
                            className="absolute inset-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={16} className="absolute -top-2 -right-2 text-luxury-gold-400" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mb-12"
                >
                    <h1 className="heading-luxury mb-6 animate-gold-shimmer">
                        UNIC México
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="font-script text-2xl md:text-3xl text-luxury-champagne-600 font-light italic">
                        {language === 'es' ? 'Artesanía Excepcional' : 'Exceptional Craftsmanship'}
                    </p>
                </motion.div>
                
                {/* Description */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mb-12 max-w-4xl mx-auto"
                >
                    <p className="text-elegant text-lg md:text-xl mb-6">
                        {language === 'es' 
                            ? 'Descubre la fusión perfecta entre la tradición artesanal mexicana y el diseño contemporáneo. Cada pieza cuenta una historia única de elegancia y sofisticación.'
                            : 'Discover the perfect fusion of Mexican artisanal tradition and contemporary design. Each piece tells a unique story of elegance and sophistication.'
                        }
                    </p>
                    <p className="text-stone-500 text-base md:text-lg">
                        {language === 'es'
                            ? 'Creado a mano con pasión, diseñado para la eternidad'
                            : 'Handcrafted with passion, designed for eternity'
                        }
                    </p>
                </motion.div>
                
                {/* CTA Buttons */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                >
                    <Link href="#collection">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-luxury group"
                        >
                            <span>{language === 'es' ? 'Explorar Colección' : 'Explore Collection'}</span>
                            <motion.div 
                                className="ml-2 group-hover:translate-x-1 transition-transform"
                                whileHover={{ x: 4 }}
                            >
                                →
                            </motion.div>
                        </motion.button>
                    </Link>
                    
                    <Link href="/about">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline-luxury"
                        >
                            {language === 'es' ? 'Nuestra Historia' : 'Our Story'}
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16"
                >
                    <div className="text-center">
                        <div className="font-display text-2xl font-bold text-luxury-champagne-600 mb-2">25+</div>
                        <div className="text-stone-600 text-sm uppercase tracking-wide">
                            {language === 'es' ? 'Años de Experiencia' : 'Years of Experience'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-display text-2xl font-bold text-luxury-champagne-600 mb-2">100%</div>
                        <div className="text-stone-600 text-sm uppercase tracking-wide">
                            {language === 'es' ? 'Hecho a Mano' : 'Handcrafted'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-display text-2xl font-bold text-luxury-champagne-600 mb-2">∞</div>
                        <div className="text-stone-600 text-sm uppercase tracking-wide">
                            {language === 'es' ? 'Belleza Eterna' : 'Eternal Beauty'}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                        document.getElementById('collection')?.scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }}
                >
                    <span className="text-stone-400 text-xs uppercase tracking-widest mb-2">
                        {language === 'es' ? 'Descubrir' : 'Discover'}
                    </span>
                    <ChevronDown size={24} className="text-luxury-champagne-500" />
                </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-champagne-300 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-champagne-300 to-transparent" />
        </section>
    );
}
