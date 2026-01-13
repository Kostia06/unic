import type { Product, FAQ } from '$types';

// Placeholder image URLs (using placeholder services for development)
const placeholderImages = {
	ring1: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
	ring2: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop',
	necklace1: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
	necklace2: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
	earrings1: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
	earrings2: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&h=800&fit=crop',
	bracelet1: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
	bracelet2: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
	pendant1: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop',
	pendant2: 'https://images.unsplash.com/photo-1576022162028-bec68e4a4b96?w=800&h=800&fit=crop',
	set1: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop',
	set2: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&h=800&fit=crop'
};

export const mockProducts: Product[] = [
	{
		id: '1',
		name_es: 'Anillo Nebulosa',
		name_en: 'Nebula Ring',
		description_es: 'Un anillo inspirado en las nebulosas del espacio profundo. Cada gema representa una estrella en formación, capturando la esencia del cosmos en tu dedo.',
		description_en: 'A ring inspired by deep space nebulas. Each gem represents a star in formation, capturing the essence of the cosmos on your finger.',
		category: 'anillos',
		base_price_mxn: 2850,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '1-1', product_id: '1', url: placeholderImages.ring1, is_primary: true, sort_order: 0 },
			{ id: '1-2', product_id: '1', url: placeholderImages.ring2, is_primary: false, sort_order: 1 }
		],
		variant_types: [
			{
				id: 'vt-1',
				product_id: '1',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-1', variant_type_id: 'vt-1', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-2', variant_type_id: 'vt-1', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 },
					{ id: 'vo-3', variant_type_id: 'vt-1', name_es: 'Oro Rosa 14k', name_en: '14k Rose Gold', sort_order: 2 }
				]
			},
			{
				id: 'vt-2',
				product_id: '1',
				name_es: 'Gema',
				name_en: 'Gem',
				sort_order: 1,
				options: [
					{ id: 'vo-4', variant_type_id: 'vt-2', name_es: 'Amatista', name_en: 'Amethyst', sort_order: 0 },
					{ id: 'vo-5', variant_type_id: 'vt-2', name_es: 'Zafiro Azul', name_en: 'Blue Sapphire', sort_order: 1 },
					{ id: 'vo-6', variant_type_id: 'vt-2', name_es: 'Topacio', name_en: 'Topaz', sort_order: 2 }
				]
			}
		],
		variants: [
			{ id: 'v-1', product_id: '1', options: { material: 'plata-925', gema: 'amatista' }, price_mxn: 2850, image_url: placeholderImages.ring1, is_active: true },
			{ id: 'v-2', product_id: '1', options: { material: 'oro-14k', gema: 'amatista' }, price_mxn: 8500, image_url: placeholderImages.ring1, is_active: true },
			{ id: 'v-3', product_id: '1', options: { material: 'oro-rosa-14k', gema: 'zafiro-azul' }, price_mxn: 9200, image_url: placeholderImages.ring2, is_active: true }
		]
	},
	{
		id: '2',
		name_es: 'Collar Vía Láctea',
		name_en: 'Milky Way Necklace',
		description_es: 'Un collar que representa nuestra galaxia. Pequeñas estrellas de diamante trazan el camino de la Vía Láctea alrededor de tu cuello.',
		description_en: 'A necklace that represents our galaxy. Small diamond stars trace the path of the Milky Way around your neck.',
		category: 'collares',
		base_price_mxn: 4200,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '2-1', product_id: '2', url: placeholderImages.necklace1, is_primary: true, sort_order: 0 },
			{ id: '2-2', product_id: '2', url: placeholderImages.necklace2, is_primary: false, sort_order: 1 }
		],
		variant_types: [
			{
				id: 'vt-3',
				product_id: '2',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-7', variant_type_id: 'vt-3', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-8', variant_type_id: 'vt-3', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			},
			{
				id: 'vt-4',
				product_id: '2',
				name_es: 'Largo',
				name_en: 'Length',
				sort_order: 1,
				options: [
					{ id: 'vo-9', variant_type_id: 'vt-4', name_es: '40cm', name_en: '16"', sort_order: 0 },
					{ id: 'vo-10', variant_type_id: 'vt-4', name_es: '45cm', name_en: '18"', sort_order: 1 },
					{ id: 'vo-11', variant_type_id: 'vt-4', name_es: '50cm', name_en: '20"', sort_order: 2 }
				]
			}
		],
		variants: [
			{ id: 'v-4', product_id: '2', options: { material: 'plata-925', largo: '40cm' }, price_mxn: 4200, image_url: placeholderImages.necklace1, is_active: true },
			{ id: 'v-5', product_id: '2', options: { material: 'plata-925', largo: '45cm' }, price_mxn: 4500, image_url: placeholderImages.necklace1, is_active: true },
			{ id: 'v-6', product_id: '2', options: { material: 'oro-14k', largo: '45cm' }, price_mxn: 12500, image_url: placeholderImages.necklace2, is_active: true }
		]
	},
	{
		id: '3',
		name_es: 'Aretes Constelación',
		name_en: 'Constellation Earrings',
		description_es: 'Aretes que capturan las constelaciones del cielo nocturno. Cada par es una obra de arte celestial única.',
		description_en: 'Earrings that capture the constellations of the night sky. Each pair is a unique celestial work of art.',
		category: 'aretes',
		base_price_mxn: 1950,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '3-1', product_id: '3', url: placeholderImages.earrings1, is_primary: true, sort_order: 0 },
			{ id: '3-2', product_id: '3', url: placeholderImages.earrings2, is_primary: false, sort_order: 1 }
		],
		variant_types: [
			{
				id: 'vt-5',
				product_id: '3',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-12', variant_type_id: 'vt-5', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-13', variant_type_id: 'vt-5', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-7', product_id: '3', options: { material: 'plata-925' }, price_mxn: 1950, image_url: placeholderImages.earrings1, is_active: true },
			{ id: 'v-8', product_id: '3', options: { material: 'oro-14k' }, price_mxn: 5800, image_url: placeholderImages.earrings2, is_active: true }
		]
	},
	{
		id: '4',
		name_es: 'Pulsera Eclipse',
		name_en: 'Eclipse Bracelet',
		description_es: 'Una pulsera que representa el mágico momento de un eclipse. La luna de ónix abraza el sol dorado en perfecta armonía.',
		description_en: 'A bracelet representing the magical moment of an eclipse. The onyx moon embraces the golden sun in perfect harmony.',
		category: 'pulseras',
		base_price_mxn: 2400,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '4-1', product_id: '4', url: placeholderImages.bracelet1, is_primary: true, sort_order: 0 },
			{ id: '4-2', product_id: '4', url: placeholderImages.bracelet2, is_primary: false, sort_order: 1 }
		],
		variant_types: [
			{
				id: 'vt-6',
				product_id: '4',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-14', variant_type_id: 'vt-6', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-15', variant_type_id: 'vt-6', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-9', product_id: '4', options: { material: 'plata-925' }, price_mxn: 2400, image_url: placeholderImages.bracelet1, is_active: true },
			{ id: 'v-10', product_id: '4', options: { material: 'oro-14k' }, price_mxn: 7200, image_url: placeholderImages.bracelet2, is_active: true }
		]
	},
	{
		id: '5',
		name_es: 'Dije Luna Creciente',
		name_en: 'Crescent Moon Pendant',
		description_es: 'Un delicado dije que captura la luna en su fase más mística. Perfecto para soñadoras y amantes de la noche.',
		description_en: 'A delicate pendant capturing the moon in its most mystical phase. Perfect for dreamers and night lovers.',
		category: 'dijes',
		base_price_mxn: 1650,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '5-1', product_id: '5', url: placeholderImages.pendant1, is_primary: true, sort_order: 0 },
			{ id: '5-2', product_id: '5', url: placeholderImages.pendant2, is_primary: false, sort_order: 1 }
		],
		variant_types: [
			{
				id: 'vt-7',
				product_id: '5',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-16', variant_type_id: 'vt-7', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-17', variant_type_id: 'vt-7', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-11', product_id: '5', options: { material: 'plata-925' }, price_mxn: 1650, image_url: placeholderImages.pendant1, is_active: true },
			{ id: 'v-12', product_id: '5', options: { material: 'oro-14k' }, price_mxn: 4950, image_url: placeholderImages.pendant2, is_active: true }
		]
	},
	{
		id: '6',
		name_es: 'Set Estrella Polar',
		name_en: 'North Star Set',
		description_es: 'Un set completo inspirado en la estrella que guía a los viajeros. Incluye collar, aretes y anillo a juego.',
		description_en: 'A complete set inspired by the star that guides travelers. Includes matching necklace, earrings, and ring.',
		category: 'sets',
		base_price_mxn: 6800,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '6-1', product_id: '6', url: placeholderImages.set1, is_primary: true, sort_order: 0 },
			{ id: '6-2', product_id: '6', url: placeholderImages.set2, is_primary: false, sort_order: 1 }
		],
		variant_types: [
			{
				id: 'vt-8',
				product_id: '6',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-18', variant_type_id: 'vt-8', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-19', variant_type_id: 'vt-8', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-13', product_id: '6', options: { material: 'plata-925' }, price_mxn: 6800, image_url: placeholderImages.set1, is_active: true },
			{ id: 'v-14', product_id: '6', options: { material: 'oro-14k' }, price_mxn: 19500, image_url: placeholderImages.set2, is_active: true }
		]
	},
	{
		id: '7',
		name_es: 'Anillo Órbita',
		name_en: 'Orbit Ring',
		description_es: 'Un anillo con diseño de órbitas planetarias. Múltiples aros que giran alrededor de una gema central.',
		description_en: 'A ring with planetary orbit design. Multiple bands that spin around a central gem.',
		category: 'anillos',
		base_price_mxn: 3200,
		has_variants: false,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '7-1', product_id: '7', url: placeholderImages.ring2, is_primary: true, sort_order: 0 }
		],
		variant_types: [],
		variants: []
	},
	{
		id: '8',
		name_es: 'Collar Supernova',
		name_en: 'Supernova Necklace',
		description_es: 'Inspirado en la explosión de una supernova. Un diseño dramático que captura el momento más brillante del universo.',
		description_en: 'Inspired by a supernova explosion. A dramatic design capturing the brightest moment in the universe.',
		category: 'collares',
		base_price_mxn: 5500,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '8-1', product_id: '8', url: placeholderImages.necklace2, is_primary: true, sort_order: 0 }
		],
		variant_types: [
			{
				id: 'vt-9',
				product_id: '8',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-20', variant_type_id: 'vt-9', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-21', variant_type_id: 'vt-9', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-15', product_id: '8', options: { material: 'plata-925' }, price_mxn: 5500, image_url: placeholderImages.necklace2, is_active: true },
			{ id: 'v-16', product_id: '8', options: { material: 'oro-14k' }, price_mxn: 15800, image_url: placeholderImages.necklace2, is_active: true }
		]
	},
	{
		id: '9',
		name_es: 'Aretes Meteorito',
		name_en: 'Meteorite Earrings',
		description_es: 'Aretes con textura de meteorito real. Cada par es tan único como las rocas que caen del cielo.',
		description_en: 'Earrings with real meteorite texture. Each pair is as unique as the rocks falling from the sky.',
		category: 'aretes',
		base_price_mxn: 2200,
		has_variants: false,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '9-1', product_id: '9', url: placeholderImages.earrings2, is_primary: true, sort_order: 0 }
		],
		variant_types: [],
		variants: []
	},
	{
		id: '10',
		name_es: 'Pulsera Cosmos',
		name_en: 'Cosmos Bracelet',
		description_es: 'Una pulsera que representa todo el cosmos. Planetas de diferentes piedras preciosas en una cadena celestial.',
		description_en: 'A bracelet representing the entire cosmos. Planets made of different gemstones on a celestial chain.',
		category: 'pulseras',
		base_price_mxn: 3800,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '10-1', product_id: '10', url: placeholderImages.bracelet2, is_primary: true, sort_order: 0 }
		],
		variant_types: [
			{
				id: 'vt-10',
				product_id: '10',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-22', variant_type_id: 'vt-10', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-23', variant_type_id: 'vt-10', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-17', product_id: '10', options: { material: 'plata-925' }, price_mxn: 3800, image_url: placeholderImages.bracelet2, is_active: true },
			{ id: 'v-18', product_id: '10', options: { material: 'oro-14k' }, price_mxn: 11200, image_url: placeholderImages.bracelet2, is_active: true }
		]
	},
	{
		id: '11',
		name_es: 'Dije Saturno',
		name_en: 'Saturn Pendant',
		description_es: 'Un dije del planeta más icónico. Los anillos de Saturno giran libremente alrededor de la esfera central.',
		description_en: 'A pendant of the most iconic planet. Saturn rings spin freely around the central sphere.',
		category: 'dijes',
		base_price_mxn: 2100,
		has_variants: false,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '11-1', product_id: '11', url: placeholderImages.pendant2, is_primary: true, sort_order: 0 }
		],
		variant_types: [],
		variants: []
	},
	{
		id: '12',
		name_es: 'Anillo Aurora Boreal',
		name_en: 'Northern Lights Ring',
		description_es: 'Un anillo que captura los colores de la aurora boreal. Ópalos que cambian de color con la luz.',
		description_en: 'A ring capturing the colors of the northern lights. Opals that change color with light.',
		category: 'anillos',
		base_price_mxn: 4500,
		has_variants: true,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		images: [
			{ id: '12-1', product_id: '12', url: placeholderImages.ring1, is_primary: true, sort_order: 0 }
		],
		variant_types: [
			{
				id: 'vt-11',
				product_id: '12',
				name_es: 'Material',
				name_en: 'Material',
				sort_order: 0,
				options: [
					{ id: 'vo-24', variant_type_id: 'vt-11', name_es: 'Plata 925', name_en: 'Sterling Silver', sort_order: 0 },
					{ id: 'vo-25', variant_type_id: 'vt-11', name_es: 'Oro 14k', name_en: '14k Gold', sort_order: 1 }
				]
			}
		],
		variants: [
			{ id: 'v-19', product_id: '12', options: { material: 'plata-925' }, price_mxn: 4500, image_url: placeholderImages.ring1, is_active: true },
			{ id: 'v-20', product_id: '12', options: { material: 'oro-14k' }, price_mxn: 13500, image_url: placeholderImages.ring1, is_active: true }
		]
	}
];

export const mockFaqs: FAQ[] = [
	{
		id: '1',
		question_es: '¿Cuánto tarda el envío?',
		question_en: 'How long does shipping take?',
		answer_es: 'Los envíos dentro de México tardan de 3 a 7 días hábiles. Para envíos internacionales, el tiempo estimado es de 10 a 15 días hábiles dependiendo del destino.',
		answer_en: 'Shipping within Mexico takes 3-7 business days. For international shipments, estimated time is 10-15 business days depending on destination.',
		sort_order: 0,
		is_active: true
	},
	{
		id: '2',
		question_es: '¿Hacen envíos internacionales?',
		question_en: 'Do you ship internationally?',
		answer_es: 'Sí, enviamos a todo el mundo. Los costos de envío se calculan automáticamente al momento del checkout según tu ubicación.',
		answer_en: 'Yes, we ship worldwide. Shipping costs are automatically calculated at checkout based on your location.',
		sort_order: 1,
		is_active: true
	},
	{
		id: '3',
		question_es: '¿Puedo personalizar una pieza?',
		question_en: 'Can I customize a piece?',
		answer_es: 'Absolutamente. Ofrecemos servicios de personalización para la mayoría de nuestras piezas. Contáctanos para discutir tu visión y te daremos un presupuesto.',
		answer_en: 'Absolutely. We offer customization services for most of our pieces. Contact us to discuss your vision and we will provide a quote.',
		sort_order: 2,
		is_active: true
	},
	{
		id: '4',
		question_es: '¿Qué materiales utilizan?',
		question_en: 'What materials do you use?',
		answer_es: 'Trabajamos con plata 925, oro de 14k y 18k, y piedras preciosas naturales certificadas. Todos nuestros materiales son de origen ético y sostenible.',
		answer_en: 'We work with sterling silver 925, 14k and 18k gold, and certified natural gemstones. All our materials are ethically and sustainably sourced.',
		sort_order: 3,
		is_active: true
	},
	{
		id: '5',
		question_es: '¿Cuál es su política de devoluciones?',
		question_en: 'What is your return policy?',
		answer_es: 'Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en su condición original. Las piezas personalizadas no son elegibles para devolución.',
		answer_en: 'We accept returns within 30 days of purchase, as long as the product is in its original condition. Customized pieces are not eligible for return.',
		sort_order: 4,
		is_active: true
	},
	{
		id: '6',
		question_es: '¿Cómo cuido mis joyas?',
		question_en: 'How do I care for my jewelry?',
		answer_es: 'Recomendamos guardar tus joyas en un lugar seco y evitar el contacto con perfumes, lociones o agua. Limpia suavemente con un paño de microfibra para mantener su brillo.',
		answer_en: 'We recommend storing your jewelry in a dry place and avoiding contact with perfumes, lotions or water. Gently clean with a microfiber cloth to maintain shine.',
		sort_order: 5,
		is_active: true
	}
];

// Product categories for filtering
export const productCategories = [
	{ value: 'all', label_es: 'Todos', label_en: 'All' },
	{ value: 'anillos', label_es: 'Anillos', label_en: 'Rings' },
	{ value: 'collares', label_es: 'Collares', label_en: 'Necklaces' },
	{ value: 'aretes', label_es: 'Aretes', label_en: 'Earrings' },
	{ value: 'pulseras', label_es: 'Pulseras', label_en: 'Bracelets' },
	{ value: 'dijes', label_es: 'Dijes', label_en: 'Pendants' },
	{ value: 'sets', label_es: 'Sets', label_en: 'Sets' }
];
