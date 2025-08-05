"use client";
// Temporarily disabled framer-motion to fix build issues
// import { motion } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { Award, Shield, Truck, HeartHandshake, Sparkles, Crown } from "lucide-react";

export default function FeaturesSection() {
    const { language } = useTranslation();

    const features = [
        {
            icon: Crown,
            title: language === 'es' ? 'Artesanía Premium' : 'Premium Craftsmanship',
            description: language === 'es' 
                ? 'Cada pieza es creada a mano por maestros artesanos con décadas de experiencia'
                : 'Each piece is handcrafted by master artisans with decades of experience',
            color: 'text-luxury-champagne-500'
        },
        {
            icon: Award,
            title: language === 'es' ? 'Materiales Exclusivos' : 'Exclusive Materials',
            description: language === 'es'
                ? 'Utilizamos solo los metales más finos y gemas auténticas de la más alta calidad'
                : 'We use only the finest metals and authentic gems of the highest quality',
            color: 'text-luxury-gold-500'
        },
        {
            icon: Shield,
            title: language === 'es' ? 'Garantía de Por Vida' : 'Lifetime Warranty',
            description: language === 'es'
                ? 'Respaldamos la calidad de nuestras joyas con una garantía completa de por vida'
                : 'We back the quality of our jewelry with a comprehensive lifetime warranty',
            color: 'text-luxury-bronze-500'
        },
        {
            icon: Truck,
            title: language === 'es' ? 'Envío Seguro Gratuito' : 'Free Secure Shipping',
            description: language === 'es'
                ? 'Entrega gratuita y asegurada en todo México y envíos internacionales disponibles'
                : 'Free insured delivery throughout Mexico and international shipping available',
            color: 'text-blue-500'
        },
        {
            icon: HeartHandshake,
            title: language === 'es' ? 'Servicio Personalizado' : 'Personalized Service',
            description: language === 'es'
                ? 'Asesoría experta y atención personalizada para encontrar la pieza perfecta'
                : 'Expert advice and personalized attention to find the perfect piece',
            color: 'text-rose-500'
        },
        {
            icon: Sparkles,
            title: language === 'es' ? 'Diseños Únicos' : 'Unique Designs',
            description: language === 'es'
                ? 'Creaciones exclusivas que no encontrarás en ningún otro lugar del mundo'
                : 'Exclusive creations that you won\'t find anywhere else in the world',
            color: 'text-purple-500'
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container-luxury section-padding">
                {/* Header */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <h2 className="subheading-luxury mb-6">
                        {language === 'es' ? 'La Excelencia en Cada Detalle' : 'Excellence in Every Detail'}
                    </h2>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-lg max-w-3xl mx-auto">
                        {language === 'es'
                            ? 'Nuestro compromiso con la perfección se refleja en cada aspecto de nuestro trabajo, desde la selección de materiales hasta el servicio al cliente.'
                            : 'Our commitment to perfection is reflected in every aspect of our work, from material selection to customer service.'
                        }
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card-luxury group p-8 text-center hover:shadow-luxury animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex justify-center mb-6">
                                <div className={`p-4 rounded-full bg-stone-50 ${feature.color}`}>
                                    <feature.icon size={32} />
                                </div>
                            </div>
                            
                            <h3 className="font-display text-xl font-semibold text-stone-800 mb-4">
                                {feature.title}
                            </h3>
                            
                            <p className="text-elegant">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 animate-fade-in-up">
                    <button className="btn-outline-luxury hover:scale-105 transition-transform">
                        {language === 'es' ? 'Conoce Más Sobre Nosotros' : 'Learn More About Us'}
                    </button>
                </div>
            </div>
        </section>
    );
}