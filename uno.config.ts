import {
	defineConfig,
	presetUno,
	presetIcons,
	transformerDirectives
} from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			cdn: 'https://esm.sh/'
		})
	],
	transformers: [
		transformerDirectives()
	],
	theme: {
		colors: {
			// Navy - Backgrounds (Crescent Sicily inspired)
			navy: {
				deepest: '#001239',
				deep: '#001a4d',
				medium: '#002266',
				light: '#003080'
			},
			// White - Primary text
			white: {
				DEFAULT: '#ffffff',
				90: 'rgba(255, 255, 255, 0.9)',
				70: 'rgba(255, 255, 255, 0.7)',
				50: 'rgba(255, 255, 255, 0.5)',
				30: 'rgba(255, 255, 255, 0.3)',
				10: 'rgba(255, 255, 255, 0.1)'
			},
			// Accents - Used for emphasis
			accent: {
				purple: '#8b5cf6',
				pink: '#ec4899',
				gold: '#fbbf24',
				blue: '#3b82f6'
			}
		},
		fontFamily: {
			display: ['Playfair Display', 'Georgia', 'serif'],
			script: ['Pinyon Script', 'cursive'],
			body: ['Inter', 'system-ui', 'sans-serif'],
			mono: ['JetBrains Mono', 'monospace']
		},
		fontSize: {
			// Fluid type scale - Crescent Sicily inspired bold contrasts
			'massive': 'clamp(6rem, 20vw, 16rem)',
			'hero': 'clamp(3rem, 10vw, 8rem)',
			'display': 'clamp(2.5rem, 6vw, 5rem)',
			'title': 'clamp(1.75rem, 4vw, 3rem)',
			'subtitle': 'clamp(1.25rem, 2vw, 1.75rem)',
			'body': 'clamp(1rem, 1.2vw, 1.125rem)',
			'small': 'clamp(0.75rem, 1vw, 0.875rem)',
			'micro': '0.6875rem'
		},
		animation: {
			keyframes: {
				'fade-in': '{from { opacity: 0 } to { opacity: 1 }}',
				'fade-up': '{from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) }}',
				'slide-in-right': '{from { opacity: 0; transform: translateX(100%) } to { opacity: 1; transform: translateX(0) }}',
				'slide-in-left': '{from { opacity: 0; transform: translateX(-100%) } to { opacity: 1; transform: translateX(0) }}',
				'slide-in-up': '{from { opacity: 0; transform: translateX(-50px) } to { opacity: 1; transform: translateX(0) }}',
				'float': '{0%, 100% { transform: translateY(0) rotate(-2deg) } 50% { transform: translateY(-30px) rotate(2deg) }}',
				'float-subtle': '{0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) }}',
				'marquee': '{from { transform: translateX(0) } to { transform: translateX(-50%) }}',
				'rotate-slow': '{from { transform: rotate(0deg) } to { transform: rotate(360deg) }}',
				'glow-pulse': '{0%, 100% { opacity: 0.5 } 50% { opacity: 1 }}'
			},
			durations: {
				'fade-in': '0.5s',
				'fade-up': '0.6s',
				'slide-in-right': '0.4s',
				'slide-in-left': '0.4s',
				'slide-in-up': '0.8s',
				'float': '6s',
				'float-subtle': '4s',
				'marquee': '30s',
				'rotate-slow': '30s',
				'glow-pulse': '4s'
			},
			timingFns: {
				'fade-in': 'ease-out',
				'fade-up': 'ease-out',
				'slide-in-right': 'cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-in-left': 'cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-in-up': 'ease-out',
				'float': 'ease-in-out',
				'float-subtle': 'ease-in-out',
				'marquee': 'linear',
				'rotate-slow': 'linear',
				'glow-pulse': 'ease-in-out'
			},
			counts: {
				'float': 'infinite',
				'float-subtle': 'infinite',
				'marquee': 'infinite',
				'rotate-slow': 'infinite',
				'glow-pulse': 'infinite'
			}
		},
		breakpoints: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		}
	},
	shortcuts: {
		// Layout - Crescent inspired
		'grid-base': 'grid grid-cols-12 gap-6 px-[clamp(1.5rem,5vw,6rem)] max-w-[1600px] mx-auto',
		'container-main': 'max-w-[1600px] mx-auto px-[clamp(1.5rem,5vw,6rem)]',

		// Section padding
		'section-padding': 'py-[clamp(4rem,10vh,8rem)]',

		// Buttons - bold, playful style
		'btn': 'inline-flex items-center justify-center gap-3 font-body text-small uppercase tracking-[0.1em] transition-all duration-400',
		'btn-primary': 'btn px-8 py-4 border border-white-30 text-white hover:bg-white hover:text-navy-deepest hover:border-white',
		'btn-secondary': 'btn px-8 py-4 border border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white',
		'btn-ghost': 'btn text-white-50 hover:text-white',
		'btn-solid': 'btn px-8 py-4 bg-white text-navy-deepest hover:bg-accent-purple hover:text-white',

		// Cards
		'card-base': 'relative bg-navy-deep border border-white-10 transition-all duration-300',

		// Text effects
		'text-glow-purple': 'drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]',
		'text-glow-pink': 'drop-shadow-[0_0_40px_rgba(236,72,153,0.3)]',
		'text-glow-white': 'drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]',

		// Form elements
		'input-base': 'w-full bg-transparent border border-white-30 px-4 py-3 text-white placeholder:text-white-30 focus:outline-none focus:border-accent-purple transition-all duration-300',

		// Links with animated underline
		'link-animated': 'relative text-white-70 hover:text-white transition-colors duration-300',

		// Glass effect
		'glass': 'bg-navy-deep/80 backdrop-blur-[20px] border border-white-10',
		'glass-subtle': 'bg-navy-deep/60 backdrop-blur-[10px]',

		// Product grid
		'product-grid': 'grid grid-cols-12 gap-8'
	},
	safelist: [
		'animate-fade-in',
		'animate-fade-up',
		'animate-slide-in-right',
		'animate-slide-in-left',
		'animate-slide-in-up',
		'animate-float',
		'animate-float-subtle',
		'animate-marquee',
		'animate-rotate-slow',
		'animate-glow-pulse'
	]
});
