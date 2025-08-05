"use client";
import { useTranslation } from "@/lib/translation-context";
import { Crown, Award, Heart, Sparkles, Users, Globe } from "lucide-react";

export default function AboutPage() {
    const { language } = useTranslation();

    const values = [
        {
            icon: Crown,
            title: language === 'es' ? 'Excelencia Artesanal' : 'Artisanal Excellence',
            description: language === 'es' 
                ? 'Cada pieza es creada por maestros artesanos con décadas de experiencia en la tradición joyera mexicana.'
                : 'Each piece is created by master artisans with decades of experience in Mexican jewelry tradition.'
        },
        {
            icon: Heart,
            title: language === 'es' ? 'Pasión por el Detalle' : 'Passion for Detail',
            description: language === 'es'
                ? 'Nos obsesionamos con cada detalle, desde la selección de gemas hasta el acabado final.'
                : 'We obsess over every detail, from gem selection to final finishing.'
        },
        {
            icon: Globe,
            title: language === 'es' ? 'Herencia Cultural' : 'Cultural Heritage',
            description: language === 'es'
                ? 'Honramos la rica tradición joyera mexicana mientras abrazamos la innovación contemporánea.'
                : 'We honor rich Mexican jewelry tradition while embracing contemporary innovation.'
        }
    ];

    const team = [
        {
            name: "Elena Martínez",
            role: language === 'es' ? "Fundadora y Diseñadora Principal" : "Founder & Lead Designer",
            image: "/api/placeholder/300/400",
            description: language === 'es'
                ? "Con más de 20 años de experiencia, Elena combina técnicas tradicionales con visión contemporánea."
                : "With over 20 years of experience, Elena combines traditional techniques with contemporary vision."
        },
        {
            name: "Carlos Hernández",
            role: language === 'es' ? "Maestro Artesano" : "Master Craftsman",
            image: "/api/placeholder/300/400",
            description: language === 'es'
                ? "Tercera generación de joyeros, Carlos aporta décadas de conocimiento ancestral a cada creación."
                : "Third generation jeweler, Carlos brings decades of ancestral knowledge to each creation."
        },
        {
            name: "Sofia Rodríguez",
            role: language === 'es' ? "Especialista en Gemas" : "Gemstone Specialist",
            image: "/api/placeholder/300/400",
            description: language === 'es'
                ? "Gemóloga certificada, Sofia selecciona personalmente cada piedra para garantizar la máxima calidad."
                : "Certified gemologist, Sofia personally selects each stone to guarantee maximum quality."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-r from-luxury-champagne-50 to-stone-50">
                <div className="container-luxury section-padding text-center">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <Crown size={48} className="text-luxury-champagne-600" />
                            <div className="absolute -top-2 -right-2 animate-pulse">
                                <Sparkles size={20} className="text-luxury-gold-400" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="heading-luxury mb-6">
                        {language === 'es' ? 'Nuestra Historia' : 'Our Story'}
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-xl max-w-4xl mx-auto">
                        {language === 'es'
                            ? 'Desde 2005, UNIC México ha sido sinónimo de excelencia en joyería artesanal, combinando la rica tradición mexicana con diseño contemporáneo de lujo.'
                            : 'Since 2005, UNIC México has been synonymous with excellence in artisanal jewelry, combining rich Mexican tradition with contemporary luxury design.'
                        }
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="container-luxury section-padding">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="subheading-luxury">
                                {language === 'es' ? 'Una Tradición de Excelencia' : 'A Tradition of Excellence'}
                            </h2>
                            <div className="space-y-6 text-elegant">
                                <p>
                                    {language === 'es'
                                        ? 'Todo comenzó con un sueño: crear joyas que no solo fueran hermosas, sino que contaran historias. Cada pieza que creamos lleva consigo la pasión de nuestros artesanos y la rica herencia cultural de México.'
                                        : 'It all began with a dream: to create jewelry that was not only beautiful, but told stories. Each piece we create carries with it the passion of our artisans and the rich cultural heritage of Mexico.'
                                    }
                                </p>
                                <p>
                                    {language === 'es'
                                        ? 'A lo largo de los años, hemos perfeccionado nuestro arte, combinando técnicas ancestrales con innovación moderna para crear piezas verdaderamente únicas que trascienden las tendencias temporales.'
                                        : 'Over the years, we have perfected our art, combining ancestral techniques with modern innovation to create truly unique pieces that transcend temporal trends.'
                                    }
                                </p>
                                <p>
                                    {language === 'es'
                                        ? 'Hoy, UNIC México es reconocida internacionalmente por su calidad excepcional y diseños exclusivos que celebran tanto la tradición como la modernidad.'
                                        : 'Today, UNIC México is internationally recognized for its exceptional quality and exclusive designs that celebrate both tradition and modernity.'
                                    }
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <img
                                src="/api/placeholder/600/500"
                                alt="UNIC México Workshop"
                                className="card-luxury w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent card-luxury" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gradient-to-b from-white to-stone-50">
                <div className="container-luxury section-padding">
                    <div className="text-center mb-16">
                        <h2 className="subheading-luxury mb-6">
                            {language === 'es' ? 'Nuestros Valores' : 'Our Values'}
                        </h2>
                        <div className="divider-luxury-wide mb-8" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="card-luxury p-8 text-center hover:shadow-luxury transition-all duration-300"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 rounded-full bg-luxury-champagne-100">
                                        <value.icon size={32} className="text-luxury-champagne-600" />
                                    </div>
                                </div>
                                <h3 className="font-display text-xl font-semibold text-stone-800 mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-elegant">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="container-luxury section-padding">
                    <div className="text-center mb-16">
                        <h2 className="subheading-luxury mb-6">
                            {language === 'es' ? 'Nuestro Equipo' : 'Our Team'}
                        </h2>
                        <div className="divider-luxury-wide mb-8" />
                        <p className="text-elegant text-lg max-w-3xl mx-auto">
                            {language === 'es'
                                ? 'Conoce a los maestros artesanos y expertos que dan vida a cada una de nuestras creaciones excepcionales.'
                                : 'Meet the master artisans and experts who bring life to each of our exceptional creations.'
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="card-luxury overflow-hidden group hover:shadow-luxury transition-all duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-display text-xl font-semibold text-stone-800 mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-luxury-champagne-600 font-medium mb-4">
                                        {member.role}
                                    </p>
                                    <p className="text-elegant text-sm">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-luxury-champagne-50 to-stone-50">
                <div className="container-luxury section-padding text-center">
                    <h2 className="subheading-luxury mb-6">
                        {language === 'es' ? '¿Listo para Descubrir la Diferencia?' : 'Ready to Discover the Difference?'}
                    </h2>
                    <p className="text-elegant text-lg max-w-2xl mx-auto mb-8">
                        {language === 'es'
                            ? 'Visita nuestra colección y descubre por qué UNIC México es la elección de quienes buscan la excelencia en joyería artesanal.'
                            : 'Visit our collection and discover why UNIC México is the choice of those seeking excellence in artisanal jewelry.'
                        }
                    </p>
                    <a 
                        href="/collections"
                        className="btn-luxury hover:scale-105 transition-transform"
                    >
                        {language === 'es' ? 'Explorar Colección' : 'Explore Collection'}
                    </a>
                </div>
            </section>
        </div>
    );
}