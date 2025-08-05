"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// Temporarily disabled framer-motion to fix build issues
// import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { Menu, X, ShoppingBag, Search, User, Crown, Globe, Heart } from "lucide-react";

const Navbar = () => {
    const { t, language, setLanguage } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeItem, setActiveItem] = useState("");

    const navigationItems = [
        { 
            name: language === 'es' ? "Inicio" : "Home", 
            href: "/" 
        },
        { 
            name: language === 'es' ? "Colecciones" : "Collections", 
            href: "/collections" 
        },
        { 
            name: language === 'es' ? "Anillos" : "Rings", 
            href: "/category/rings" 
        },
        { 
            name: language === 'es' ? "Collares" : "Necklaces", 
            href: "/category/necklaces" 
        },
        { 
            name: language === 'es' ? "Aretes" : "Earrings", 
            href: "/category/earrings" 
        },
        { 
            name: language === 'es' ? "Nosotros" : "About", 
            href: "/about" 
        },
        { 
            name: language === 'es' ? "Contacto" : "Contact", 
            href: "/contact" 
        },
        { 
            name: "Admin", 
            href: "/admin" 
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled
                        ? "glass-luxury shadow-luxury-lg border-b border-luxury-champagne-200/30"
                        : "bg-transparent"
                }`}
            >
                <div className="container-luxury section-padding">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2"
                            >
                                <Crown size={28} className="text-luxury-champagne-600" />
                                <div className="font-display text-2xl font-bold text-luxury tracking-tight">
                                    UNIC México
                                </div>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onMouseEnter={() => setActiveItem(item.href)}
                                    onMouseLeave={() => setActiveItem("")}
                                    className="relative px-4 py-2 group"
                                >
                                    <motion.span
                                        className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                                            isScrolled
                                                ? "text-stone-700 group-hover:text-luxury-champagne-600"
                                                : "text-stone-800 group-hover:text-luxury-champagne-700"
                                        }`}
                                    >
                                        {item.name}
                                    </motion.span>
                                    <motion.div
                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-luxury-champagne-600"
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{
                                            width: activeItem === item.href ? "80%" : 0,
                                            opacity: activeItem === item.href ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {/* Language Switcher */}
                            <div className="flex items-center mr-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                                        isScrolled
                                            ? "bg-stone-100 text-stone-600 hover:bg-luxury-champagne-100 hover:text-luxury-champagne-700"
                                            : "bg-white/20 text-stone-700 hover:bg-white/30 backdrop-blur-sm"
                                    }`}
                                >
                                    <Globe size={14} />
                                    <span>{language.toUpperCase()}</span>
                                </motion.button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-3 rounded-full transition-all duration-300 ${
                                    isScrolled
                                        ? "text-stone-600 hover:text-luxury-champagne-600 hover:bg-luxury-champagne-50"
                                        : "text-stone-700 hover:text-luxury-champagne-700 hover:bg-white/20 backdrop-blur-sm"
                                }`}
                            >
                                <Search size={18} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-3 rounded-full transition-all duration-300 relative ${
                                    isScrolled
                                        ? "text-stone-600 hover:text-luxury-champagne-600 hover:bg-luxury-champagne-50"
                                        : "text-stone-700 hover:text-luxury-champagne-700 hover:bg-white/20 backdrop-blur-sm"
                                }`}
                            >
                                <Heart size={18} />
                                <span className="absolute -top-1 -right-1 bg-luxury-champagne-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    0
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-3 rounded-full transition-all duration-300 ${
                                    isScrolled
                                        ? "text-stone-600 hover:text-luxury-champagne-600 hover:bg-luxury-champagne-50"
                                        : "text-stone-700 hover:text-luxury-champagne-700 hover:bg-white/20 backdrop-blur-sm"
                                }`}
                            >
                                <User size={18} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-3 rounded-full transition-all duration-300 relative ${
                                    isScrolled
                                        ? "text-stone-600 hover:text-luxury-champagne-600 hover:bg-luxury-champagne-50"
                                        : "text-stone-700 hover:text-luxury-champagne-700 hover:bg-white/20 backdrop-blur-sm"
                                }`}
                            >
                                <ShoppingBag size={18} />
                                <span className="absolute -top-1 -right-1 bg-luxury-champagne-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    0
                                </span>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden p-3 rounded-full transition-all duration-300 ${
                                isScrolled
                                    ? "text-stone-600 hover:text-luxury-champagne-600 hover:bg-luxury-champagne-50"
                                    : "text-stone-700 hover:text-luxury-champagne-700 hover:bg-white/20 backdrop-blur-sm"
                            }`}
                        >
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="lg:hidden glass-luxury border-t border-luxury-champagne-200/30"
                        >
                            <div className="section-padding py-8">
                                {/* Navigation Links */}
                                <div className="flex flex-col space-y-2 mb-8">
                                    {navigationItems.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center justify-between py-3 px-4 rounded-lg text-stone-700 hover:text-luxury-champagne-600 hover:bg-luxury-champagne-50 font-medium transition-all duration-300 group"
                                            >
                                                <span>{item.name}</span>
                                                <motion.div
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    →
                                                </motion.div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Language Switcher Mobile */}
                                <div className="flex justify-center mb-6">
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                                        className="flex items-center space-x-2 px-6 py-3 bg-luxury-champagne-100 text-luxury-champagne-700 rounded-full font-medium hover:bg-luxury-champagne-200 transition-colors duration-300"
                                    >
                                        <Globe size={16} />
                                        <span>
                                            {language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                                        </span>
                                    </motion.button>
                                </div>

                                {/* Action Buttons Mobile */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="grid grid-cols-4 gap-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-luxury transition-all duration-300 group"
                                    >
                                        <Search size={20} className="text-stone-600 group-hover:text-luxury-champagne-600 transition-colors duration-300" />
                                        <span className="text-xs text-stone-500 mt-2 font-medium">
                                            {language === 'es' ? 'Buscar' : 'Search'}
                                        </span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-luxury transition-all duration-300 group relative"
                                    >
                                        <Heart size={20} className="text-stone-600 group-hover:text-luxury-champagne-600 transition-colors duration-300" />
                                        <span className="text-xs text-stone-500 mt-2 font-medium">
                                            {language === 'es' ? 'Favoritos' : 'Wishlist'}
                                        </span>
                                        <span className="absolute -top-1 -right-1 bg-luxury-champagne-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                            0
                                        </span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-luxury transition-all duration-300 group"
                                    >
                                        <User size={20} className="text-stone-600 group-hover:text-luxury-champagne-600 transition-colors duration-300" />
                                        <span className="text-xs text-stone-500 mt-2 font-medium">
                                            {language === 'es' ? 'Cuenta' : 'Account'}
                                        </span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-luxury transition-all duration-300 group relative"
                                    >
                                        <ShoppingBag size={20} className="text-stone-600 group-hover:text-luxury-champagne-600 transition-colors duration-300" />
                                        <span className="text-xs text-stone-500 mt-2 font-medium">
                                            {language === 'es' ? 'Carrito' : 'Cart'}
                                        </span>
                                        <span className="absolute -top-1 -right-1 bg-luxury-champagne-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                            0
                                        </span>
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className="h-20" />
        </>
    );
};

export default Navbar;
