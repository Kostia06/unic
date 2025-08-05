"use client";
// Temporarily disabled framer-motion to fix build issues
// import { motion } from "framer-motion";
import { useTranslation } from "@/lib/translation-context";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
    const { language } = useTranslation();

    const testimonials = [
        {
            name: "María González",
            location: language === 'es' ? "Ciudad de México" : "Mexico City",
            rating: 5,
            text: language === 'es' 
                ? "La calidad y belleza de mi collar de esmeralda superó todas mis expectativas. El servicio personalizado y la atención al detalle fueron excepcionales."
                : "The quality and beauty of my emerald necklace exceeded all my expectations. The personalized service and attention to detail were exceptional.",
            product: language === 'es' ? "Collar de Esmeralda" : "Emerald Necklace"
        },
        {
            name: "Isabella Rodríguez",
            location: "Guadalajara",
            rating: 5,
            text: language === 'es'
                ? "Compré mi anillo de compromiso aquí y no podría estar más feliz. La artesanía es impecable y representa perfectamente nuestra herencia mexicana."
                : "I bought my engagement ring here and couldn't be happier. The craftsmanship is impeccable and perfectly represents our Mexican heritage.",
            product: language === 'es' ? "Anillo de Compromiso" : "Engagement Ring"
        },
        {
            name: "Sofia Martínez",
            location: "Monterrey",
            rating: 5,
            text: language === 'es'
                ? "Cada vez que uso mis aretes de diamante recibo cumplidos. La elegancia y sofisticación de UNIC México es incomparable."
                : "Every time I wear my diamond earrings I receive compliments. The elegance and sophistication of UNIC México is incomparable.",
            product: language === 'es' ? "Aretes de Diamante" : "Diamond Earrings"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
            <div className="container-luxury section-padding">
                {/* Header */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <h2 className="subheading-luxury mb-6">
                        {language === 'es' ? 'Lo Que Dicen Nuestras Clientas' : 'What Our Clients Say'}
                    </h2>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-lg max-w-3xl mx-auto">
                        {language === 'es'
                            ? 'La confianza y satisfacción de nuestras clientas es nuestro mayor tesoro. Cada testimonio refleja nuestro compromiso con la excelencia.'
                            : 'The trust and satisfaction of our clients is our greatest treasure. Each testimonial reflects our commitment to excellence.'
                        }
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="card-luxury group p-8 relative hover:shadow-luxury animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 text-luxury-champagne-200">
                                <Quote size={32} />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex space-x-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className="text-luxury-gold-400 fill-luxury-gold-400"
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-elegant mb-6 italic leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Product Badge */}
                            <div className="inline-flex items-center px-3 py-1 bg-luxury-champagne-100 text-luxury-champagne-700 rounded-full text-sm font-medium mb-6">
                                {testimonial.product}
                            </div>

                            {/* Client Info */}
                            <div className="border-t border-stone-200 pt-6">
                                <h4 className="font-display font-semibold text-stone-800">
                                    {testimonial.name}
                                </h4>
                                <p className="text-stone-500 text-sm">
                                    {testimonial.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="text-center mt-16 pt-16 border-t border-stone-200 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="font-display text-3xl font-bold text-luxury-champagne-600 mb-2">
                                1000+
                            </div>
                            <div className="text-stone-600 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'Clientas Satisfechas' : 'Happy Clients'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="font-display text-3xl font-bold text-luxury-champagne-600 mb-2">
                                4.9
                            </div>
                            <div className="text-stone-600 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'Calificación Promedio' : 'Average Rating'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="font-display text-3xl font-bold text-luxury-champagne-600 mb-2">
                                98%
                            </div>
                            <div className="text-stone-600 text-sm uppercase tracking-wide">
                                {language === 'es' ? 'Recomendación' : 'Recommendation'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}