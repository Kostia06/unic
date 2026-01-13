import type { Language } from '$types';

export const translations = {
	es: {
		// Navigation
		nav: {
			products: 'Productos',
			about: 'Nosotros',
			testimonials: 'Testimonios',
			faq: 'Preguntas',
			contact: 'Contacto'
		},

		// Hero
		hero: {
			tagline: 'Joyas del universo, hechas para ti',
			cta: 'Explorar Colección',
			subtitle: 'Cada pieza cuenta una historia cósmica'
		},

		// Products
		products: {
			title: 'Colección',
			subtitle: 'Piezas únicas inspiradas en el cosmos',
			addToCart: 'Agregar al Carrito',
			viewDetails: 'Ver Detalles',
			filter: 'Filtrar',
			sort: 'Ordenar',
			sortOptions: {
				newest: 'Más recientes',
				priceAsc: 'Precio: menor a mayor',
				priceDesc: 'Precio: mayor a menor',
				name: 'Nombre'
			},
			loadMore: 'Cargar más',
			noProducts: 'No hay productos disponibles',
			outOfStock: 'Agotado',
			quantity: 'Cantidad',
			material: 'Material',
			selectVariant: 'Selecciona una opción'
		},

		// Cart
		cart: {
			title: 'Tu Carrito',
			empty: 'Tu carrito está vacío',
			emptyMessage: 'Agrega algunas joyas cósmicas',
			subtotal: 'Subtotal',
			checkout: 'Proceder al Pago',
			continueShopping: 'Seguir Comprando',
			remove: 'Eliminar',
			added: '¡Agregado al carrito!'
		},

		// Checkout
		checkout: {
			title: 'Finalizar Compra',
			steps: {
				contact: 'Contacto',
				shipping: 'Envío',
				review: 'Revisar',
				payment: 'Pago'
			},
			contact: {
				title: 'Información de Contacto',
				email: 'Correo electrónico',
				phone: 'Teléfono (opcional)',
				newsletter: 'Quiero recibir novedades y ofertas exclusivas'
			},
			shipping: {
				title: 'Dirección de Envío',
				fullName: 'Nombre completo',
				address: 'Dirección',
				city: 'Ciudad',
				state: 'Estado/Provincia',
				postalCode: 'Código postal',
				country: 'País'
			},
			review: {
				title: 'Revisa tu Pedido',
				orderSummary: 'Resumen del pedido',
				shippingTo: 'Envío a'
			},
			payment: {
				title: 'Información de Pago',
				processing: 'Procesando pago...'
			},
			success: {
				title: '¡Pedido Confirmado!',
				message: 'Te contactaremos pronto con instrucciones de envío.',
				orderNumber: 'Número de orden',
				backHome: 'Volver al Inicio'
			},
			buttons: {
				continue: 'Continuar',
				back: 'Atrás',
				placeOrder: 'Realizar Pedido'
			}
		},

		// About
		about: {
			title: 'Nuestra Historia',
			content: `Fam Unic nació de la fascinación por el cosmos y la belleza del universo. Cada pieza que creamos está inspirada en las estrellas, nebulosas y galaxias que adornan nuestro cielo nocturno.

Desde México, con manos artesanas y corazón cósmico, transformamos metales preciosos y gemas en pequeños universos que puedes llevar contigo.

Creemos que cada persona merece joyas tan únicas como las estrellas en el cielo. Por eso, cada pieza es elaborada con atención meticulosa al detalle, asegurando que llevas un pedazo del cosmos contigo.`
		},

		// Testimonials
		testimonials: {
			title: 'Lo que Dicen Nuestros Clientes',
			subtitle: 'Historias de quienes ya llevan el universo consigo'
		},

		// FAQ
		faq: {
			title: 'Preguntas Frecuentes',
			subtitle: 'Todo lo que necesitas saber'
		},

		// Contact
		contact: {
			title: 'Contáctanos',
			subtitle: 'Estamos aquí para ayudarte',
			form: {
				name: 'Nombre',
				email: 'Correo electrónico',
				message: 'Mensaje',
				send: 'Enviar Mensaje',
				sending: 'Enviando...',
				success: '¡Mensaje enviado! Te responderemos pronto.',
				error: 'Error al enviar. Por favor intenta de nuevo.'
			},
			info: {
				email: 'Correo',
				instagram: 'Instagram',
				location: 'Ubicación'
			}
		},

		// Footer
		footer: {
			tagline: 'Hecho con amor en México',
			links: {
				products: 'Productos',
				about: 'Nosotros',
				contact: 'Contacto',
				faq: 'Preguntas Frecuentes',
				privacy: 'Privacidad',
				terms: 'Términos'
			},
			copyright: '© 2024 Fam Unic. Todos los derechos reservados.'
		},

		// Common
		common: {
			loading: 'Cargando...',
			error: 'Algo salió mal',
			retry: 'Intentar de nuevo',
			close: 'Cerrar',
			language: 'Idioma',
			currency: 'Moneda'
		}
	},

	en: {
		// Navigation
		nav: {
			products: 'Products',
			about: 'About',
			testimonials: 'Testimonials',
			faq: 'FAQ',
			contact: 'Contact'
		},

		// Hero
		hero: {
			tagline: 'Jewelry from the universe, made for you',
			cta: 'Explore Collection',
			subtitle: 'Each piece tells a cosmic story'
		},

		// Products
		products: {
			title: 'Collection',
			subtitle: 'Unique pieces inspired by the cosmos',
			addToCart: 'Add to Cart',
			viewDetails: 'View Details',
			filter: 'Filter',
			sort: 'Sort',
			sortOptions: {
				newest: 'Newest',
				priceAsc: 'Price: low to high',
				priceDesc: 'Price: high to low',
				name: 'Name'
			},
			loadMore: 'Load more',
			noProducts: 'No products available',
			outOfStock: 'Out of stock',
			quantity: 'Quantity',
			material: 'Material',
			selectVariant: 'Select an option'
		},

		// Cart
		cart: {
			title: 'Your Cart',
			empty: 'Your cart is empty',
			emptyMessage: 'Add some cosmic jewelry',
			subtotal: 'Subtotal',
			checkout: 'Proceed to Checkout',
			continueShopping: 'Continue Shopping',
			remove: 'Remove',
			added: 'Added to cart!'
		},

		// Checkout
		checkout: {
			title: 'Checkout',
			steps: {
				contact: 'Contact',
				shipping: 'Shipping',
				review: 'Review',
				payment: 'Payment'
			},
			contact: {
				title: 'Contact Information',
				email: 'Email',
				phone: 'Phone (optional)',
				newsletter: 'I want to receive news and exclusive offers'
			},
			shipping: {
				title: 'Shipping Address',
				fullName: 'Full name',
				address: 'Address',
				city: 'City',
				state: 'State/Province',
				postalCode: 'Postal code',
				country: 'Country'
			},
			review: {
				title: 'Review Your Order',
				orderSummary: 'Order summary',
				shippingTo: 'Shipping to'
			},
			payment: {
				title: 'Payment Information',
				processing: 'Processing payment...'
			},
			success: {
				title: 'Order Confirmed!',
				message: "We'll contact you soon with shipping instructions.",
				orderNumber: 'Order number',
				backHome: 'Back to Home'
			},
			buttons: {
				continue: 'Continue',
				back: 'Back',
				placeOrder: 'Place Order'
			}
		},

		// About
		about: {
			title: 'Our Story',
			content: `Fam Unic was born from a fascination with the cosmos and the beauty of the universe. Every piece we create is inspired by the stars, nebulas, and galaxies that adorn our night sky.

From Mexico, with artisan hands and a cosmic heart, we transform precious metals and gems into small universes you can carry with you.

We believe every person deserves jewelry as unique as the stars in the sky. That's why each piece is crafted with meticulous attention to detail, ensuring you carry a piece of the cosmos with you.`
		},

		// Testimonials
		testimonials: {
			title: 'What Our Customers Say',
			subtitle: 'Stories from those who already carry the universe'
		},

		// FAQ
		faq: {
			title: 'Frequently Asked Questions',
			subtitle: 'Everything you need to know'
		},

		// Contact
		contact: {
			title: 'Contact Us',
			subtitle: "We're here to help",
			form: {
				name: 'Name',
				email: 'Email',
				message: 'Message',
				send: 'Send Message',
				sending: 'Sending...',
				success: "Message sent! We'll respond soon.",
				error: 'Error sending. Please try again.'
			},
			info: {
				email: 'Email',
				instagram: 'Instagram',
				location: 'Location'
			}
		},

		// Footer
		footer: {
			tagline: 'Made with love in Mexico',
			links: {
				products: 'Products',
				about: 'About',
				contact: 'Contact',
				faq: 'FAQ',
				privacy: 'Privacy',
				terms: 'Terms'
			},
			copyright: '© 2024 Fam Unic. All rights reserved.'
		},

		// Common
		common: {
			loading: 'Loading...',
			error: 'Something went wrong',
			retry: 'Try again',
			close: 'Close',
			language: 'Language',
			currency: 'Currency'
		}
	}
} as const;

export type TranslationKeys = typeof translations.es;

export function t(lang: Language, path: string): string {
	const keys = path.split('.');
	let value: unknown = translations[lang];

	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = (value as Record<string, unknown>)[key];
		} else {
			console.warn(`Translation missing: ${path} for ${lang}`);
			return path;
		}
	}

	return typeof value === 'string' ? value : path;
}
