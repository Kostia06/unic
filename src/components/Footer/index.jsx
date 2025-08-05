"use client";
// Temporarily disabled framer-motion to fix build issues
// import { motion } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { Crown, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LuxuryFooter() {
    const { language } = useTranslation();

    const quickLinks = [
        { 
            name: language === 'es' ? 'Inicio' : 'Home', 
            href: '/' 
        },
        { 
            name: language === 'es' ? 'Colecciones' : 'Collections', 
            href: '/collections' 
        },
        { 
            name: language === 'es' ? 'Nosotros' : 'About Us', 
            href: '/about' 
        },
        { 
            name: language === 'es' ? 'Contacto' : 'Contact', 
            href: '/contact' 
        },
    ];

    const collections = [
        { 
            name: language === 'es' ? 'Anillos' : 'Rings', 
            href: '/category/rings' 
        },
        { 
            name: language === 'es' ? 'Collares' : 'Necklaces', 
            href: '/category/necklaces' 
        },
        { 
            name: language === 'es' ? 'Aretes' : 'Earrings', 
            href: '/category/earrings' 
        },
        { 
            name: language === 'es' ? 'Pulseras' : 'Bracelets', 
            href: '/category/bracelets' 
        },
    ];

    const support = [
        { 
            name: language === 'es' ? 'Guía de Tallas' : 'Size Guide', 
            href: '/size-guide' 
        },
        { 
            name: language === 'es' ? 'Cuidado de Joyas' : 'Care Instructions', 
            href: '/care' 
        },
        { 
            name: language === 'es' ? 'Garantía' : 'Warranty', 
            href: '/warranty' 
        },
        { 
            name: language === 'es' ? 'Devoluciones' : 'Returns', 
            href: '/returns' 
        },
    ];

    const socialLinks = [
        { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
        { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
        { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    ];

    return (
        <footer className="bg-gradient-to-b from-stone-50 to-stone-100 border-t border-luxury-champagne-200/50">
            {/* Newsletter Section */}
            <section className="container-luxury section-padding py-16 border-b border-luxury-champagne-200/50 animate-fade-in-up">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Crown size={48} className="text-luxury-champagne-500" />
                            <div className="absolute -top-2 -right-2 animate-pulse">
                                <Sparkles size={16} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h3 className="subheading-luxury mb-6">
                        {language === 'es' 
                            ? 'Únete a Nuestra Exclusiva Comunidad'
                            : 'Join Our Exclusive Community'
                        }
                    </h3>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-lg mb-8 max-w-2xl mx-auto">
                        {language === 'es'
                            ? 'Sé el primero en conocer nuestras nuevas colecciones, eventos especiales y ofertas exclusivas para miembros.'
                            : 'Be the first to know about our new collections, special events, and exclusive member offers.'
                        }
                    </p>

                    <div className="flex flex-col sm:flex-row max-w-md mx-auto animate-fade-in-up">
                        <input
                            type="email"
                            placeholder={language === 'es' ? 'Tu correo electrónico' : 'Your email address'}
                            className="flex-1 px-6 py-4 rounded-l-full sm:rounded-r-none rounded-r-full border border-luxury-champagne-300 focus:outline-none focus:border-luxury-champagne-500 focus:ring-2 focus:ring-luxury-champagne-200 bg-white"
                        />
                        <button className="btn-luxury rounded-r-full sm:rounded-l-none rounded-l-full mt-4 sm:mt-0 hover:scale-105 active:scale-95 transition-transform duration-200">
                            <span>
                                {language === 'es' ? 'Suscribirse' : 'Subscribe'}
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Footer Content */}
            <div className="container-luxury section-padding py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <Crown size={32} className="text-luxury-champagne-600" />
                            <div className="font-display text-2xl font-bold text-luxury">
                                UNIC México
                            </div>
                        </Link>
                        <p className="text-elegant mb-6">
                            {language === 'es'
                                ? 'Creamos joyas excepcionales que capturan la esencia de la artesanía mexicana con un toque contemporáneo elegante.'
                                : 'We create exceptional jewelry that captures the essence of Mexican craftsmanship with an elegant contemporary touch.'
                            }
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-stone-600">
                                <MapPin size={16} className="text-luxury-champagne-500" />
                                <span className="text-sm">
                                    {language === 'es' 
                                        ? 'Ciudad de México, México'
                                        : 'Mexico City, Mexico'
                                    }
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-stone-600">
                                <Phone size={16} className="text-luxury-champagne-500" />
                                <span className="text-sm">+52 55 1234 5678</span>
                            </div>
                            <div className="flex items-center space-x-3 text-stone-600">
                                <Mail size={16} className="text-luxury-champagne-500" />
                                <span className="text-sm">hola@unicmexico.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display text-lg font-semibold text-stone-800 mb-6">
                            {language === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-stone-600 hover:text-luxury-champagne-600 transition-colors duration-300 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="font-display text-lg font-semibold text-stone-800 mb-6">
                            {language === 'es' ? 'Colecciones' : 'Collections'}
                        </h4>
                        <ul className="space-y-3">
                            {collections.map((collection) => (
                                <li key={collection.name}>
                                    <Link
                                        href={collection.href}
                                        className="text-stone-600 hover:text-luxury-champagne-600 transition-colors duration-300 text-sm"
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-display text-lg font-semibold text-stone-800 mb-6">
                            {language === 'es' ? 'Soporte' : 'Support'}
                        </h4>
                        <ul className="space-y-3 mb-6">
                            {support.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-stone-600 hover:text-luxury-champagne-600 transition-colors duration-300 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social Links */}
                        <div>
                            <h5 className="font-display text-sm font-semibold text-stone-800 mb-4">
                                {language === 'es' ? 'Síguenos' : 'Follow Us'}
                            </h5>
                            <div className="flex space-x-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className={`p-3 bg-white rounded-full shadow-lg text-stone-600 transition-all duration-300 ${social.color} hover:shadow-luxury hover:scale-110 hover:-translate-y-0.5 active:scale-90`}
                                    >
                                        <social.icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-luxury-champagne-200/50 bg-stone-100/50">
                <div className="container-luxury section-padding py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4 text-sm text-stone-600">
                            <span>
                                © 2025 UNIC México. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                            <Link href="/privacy" className="text-stone-600 hover:text-luxury-champagne-600 transition-colors duration-300">
                                {language === 'es' ? 'Privacidad' : 'Privacy'}
                            </Link>
                            <Link href="/terms" className="text-stone-600 hover:text-luxury-champagne-600 transition-colors duration-300">
                                {language === 'es' ? 'Términos' : 'Terms'}
                            </Link>
                            <div className="flex items-center space-x-1 text-stone-500">
                                <span>
                                    {language === 'es' ? 'Hecho con' : 'Made with'}
                                </span>
                                <Heart size={14} className="text-red-500 fill-red-500" />
                                <span>
                                    {language === 'es' ? 'en México' : 'in Mexico'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}