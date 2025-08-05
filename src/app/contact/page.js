"use client";
import { useState } from "react";
import { useTranslation } from "@/lib/translation-context";
import { MapPin, Phone, Mail, Clock, Send, Crown, Sparkles } from "lucide-react";

export default function ContactPage() {
    const { language } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert(language === 'es' 
            ? 'Gracias por tu mensaje. Te contactaremos pronto.' 
            : 'Thank you for your message. We will contact you soon.'
        );
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: language === 'es' ? 'Ubicación' : 'Location',
            details: [
                language === 'es' ? 'Ciudad de México, México' : 'Mexico City, Mexico',
                language === 'es' ? 'Polanco, Zona Rosa' : 'Polanco, Zona Rosa'
            ]
        },
        {
            icon: Phone,
            title: language === 'es' ? 'Teléfono' : 'Phone',
            details: [
                '+52 55 1234 5678',
                '+52 55 8765 4321'
            ]
        },
        {
            icon: Mail,
            title: language === 'es' ? 'Correo Electrónico' : 'Email',
            details: [
                'hola@unicmexico.com',
                'ventas@unicmexico.com'
            ]
        },
        {
            icon: Clock,
            title: language === 'es' ? 'Horarios' : 'Hours',
            details: [
                language === 'es' ? 'Lun - Vie: 9:00 - 19:00' : 'Mon - Fri: 9:00 - 19:00',
                language === 'es' ? 'Sáb: 10:00 - 17:00' : 'Sat: 10:00 - 17:00'
            ]
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
                        {language === 'es' ? 'Contáctanos' : 'Contact Us'}
                    </h1>
                    <div className="divider-luxury-wide mb-8" />
                    <p className="text-elegant text-xl max-w-4xl mx-auto">
                        {language === 'es'
                            ? 'Estamos aquí para ayudarte a encontrar la pieza perfecta. Nuestro equipo de expertos está listo para brindarte una atención personalizada y excepcional.'
                            : 'We are here to help you find the perfect piece. Our team of experts is ready to provide you with personalized and exceptional service.'
                        }
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-20">
                <div className="container-luxury section-padding">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="card-luxury p-6 text-center hover:shadow-luxury transition-all duration-300"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 rounded-full bg-luxury-champagne-100">
                                        <info.icon size={24} className="text-luxury-champagne-600" />
                                    </div>
                                </div>
                                <h3 className="font-display text-lg font-semibold text-stone-800 mb-3">
                                    {info.title}
                                </h3>
                                <div className="space-y-1">
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-elegant text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form and Map */}
            <section className="py-20 bg-gradient-to-b from-white to-stone-50">
                <div className="container-luxury section-padding">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div>
                            <div className="mb-8">
                                <h2 className="subheading-luxury mb-6">
                                    {language === 'es' ? 'Envíanos un Mensaje' : 'Send us a Message'}
                                </h2>
                                <p className="text-elegant">
                                    {language === 'es'
                                        ? 'Completa el formulario y nuestro equipo te contactará dentro de 24 horas.'
                                        : 'Fill out the form and our team will contact you within 24 hours.'
                                    }
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            {language === 'es' ? 'Nombre Completo' : 'Full Name'}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-champagne-500 focus:border-luxury-champagne-500 transition-colors"
                                            placeholder={language === 'es' ? 'Tu nombre completo' : 'Your full name'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            {language === 'es' ? 'Correo Electrónico' : 'Email'}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-champagne-500 focus:border-luxury-champagne-500 transition-colors"
                                            placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            {language === 'es' ? 'Teléfono' : 'Phone'}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-champagne-500 focus:border-luxury-champagne-500 transition-colors"
                                            placeholder={language === 'es' ? '+52 55 1234 5678' : '+52 55 1234 5678'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            {language === 'es' ? 'Asunto' : 'Subject'}
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-champagne-500 focus:border-luxury-champagne-500 transition-colors"
                                        >
                                            <option value="">
                                                {language === 'es' ? 'Selecciona un asunto' : 'Select a subject'}
                                            </option>
                                            <option value="general">
                                                {language === 'es' ? 'Consulta General' : 'General Inquiry'}
                                            </option>
                                            <option value="custom">
                                                {language === 'es' ? 'Joyería Personalizada' : 'Custom Jewelry'}
                                            </option>
                                            <option value="repair">
                                                {language === 'es' ? 'Reparaciones' : 'Repairs'}
                                            </option>
                                            <option value="appointment">
                                                {language === 'es' ? 'Cita Personalizada' : 'Personal Appointment'}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        {language === 'es' ? 'Mensaje' : 'Message'}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-luxury-champagne-500 focus:border-luxury-champagne-500 transition-colors resize-none"
                                        placeholder={language === 'es' 
                                            ? 'Cuéntanos cómo podemos ayudarte...'
                                            : 'Tell us how we can help you...'
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-luxury flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    <Send size={18} className="mr-2" />
                                    {language === 'es' ? 'Enviar Mensaje' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        {/* Map/Location Info */}
                        <div>
                            <div className="mb-8">
                                <h2 className="subheading-luxury mb-6">
                                    {language === 'es' ? 'Visítanos' : 'Visit Us'}
                                </h2>
                                <p className="text-elegant">
                                    {language === 'es'
                                        ? 'Te invitamos a visitar nuestro showroom en el corazón de la Ciudad de México para una experiencia personalizada.'
                                        : 'We invite you to visit our showroom in the heart of Mexico City for a personalized experience.'
                                    }
                                </p>
                            </div>

                            {/* Placeholder for Map */}
                            <div className="card-luxury h-80 bg-gradient-to-br from-luxury-champagne-100 to-stone-100 flex items-center justify-center mb-8">
                                <div className="text-center">
                                    <MapPin size={48} className="text-luxury-champagne-500 mx-auto mb-4" />
                                    <p className="text-stone-600 font-medium">
                                        {language === 'es' ? 'Mapa Interactivo' : 'Interactive Map'}
                                    </p>
                                    <p className="text-stone-500 text-sm">
                                        {language === 'es' ? 'Próximamente' : 'Coming Soon'}
                                    </p>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="card-luxury p-6">
                                <h3 className="font-display text-lg font-semibold text-stone-800 mb-4">
                                    {language === 'es' ? 'Información Adicional' : 'Additional Information'}
                                </h3>
                                <ul className="space-y-3 text-elegant text-sm">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-luxury-champagne-500 mt-1">•</span>
                                        <span>
                                            {language === 'es'
                                                ? 'Citas personalizadas disponibles fuera del horario regular'
                                                : 'Personal appointments available outside regular hours'
                                            }
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-luxury-champagne-500 mt-1">•</span>
                                        <span>
                                            {language === 'es'
                                                ? 'Servicio de entrega segura disponible en toda la República Mexicana'
                                                : 'Secure delivery service available throughout Mexico'
                                            }
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-luxury-champagne-500 mt-1">•</span>
                                        <span>
                                            {language === 'es'
                                                ? 'Consultas virtuales por videollamada disponibles'
                                                : 'Virtual consultations via video call available'
                                            }
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}