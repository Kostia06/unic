/**
 * GSAP Animation Utilities for Fam Unic
 * ZETR-inspired purposeful animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

// Global defaults - smooth, not bouncy
gsap.defaults({
	ease: 'power3.out',
	duration: 0.8
});

/**
 * Simple text splitting utility (alternative to GSAP SplitText)
 * Splits text into individual elements for animation
 */
export function splitText(
	element: HTMLElement,
	type: 'chars' | 'words' | 'lines' = 'words'
): HTMLElement[] {
	const text = element.textContent || '';
	element.textContent = '';

	let items: string[] = [];

	switch (type) {
		case 'chars':
			items = text.split('');
			break;
		case 'words':
			items = text.split(/\s+/);
			break;
		case 'lines':
			items = text.split('\n');
			break;
	}

	const elements: HTMLElement[] = [];

	items.forEach((item, index) => {
		const span = document.createElement('span');
		span.style.display = 'inline-block';
		span.textContent = item;

		if (type === 'words' && index < items.length - 1) {
			span.style.marginRight = '0.25em';
		}

		element.appendChild(span);
		elements.push(span);
	});

	return elements;
}

/**
 * Page load animation sequence
 * Like ZETR: content reveals progressively, not all at once
 */
export function pageLoadAnimation(): gsap.core.Timeline {
	const tl = gsap.timeline();

	// 1. Navigation fades in from top
	tl.from('.nav, header', {
		y: -20,
		opacity: 0,
		duration: 0.6
	});

	// 2. Hero text reveals
	const heroTitle = document.querySelector('.hero-title');
	if (heroTitle instanceof HTMLElement) {
		const words = splitText(heroTitle, 'words');
		tl.from(
			words,
			{
				y: 60,
				opacity: 0,
				stagger: 0.08,
				duration: 0.8
			},
			'-=0.3'
		);
	}

	// 3. Hero product image scales up from center
	tl.from(
		'.hero-product',
		{
			scale: 0.9,
			opacity: 0,
			duration: 1,
			ease: 'power2.out'
		},
		'-=0.5'
	);

	// 4. Secondary elements fade in
	tl.from(
		'.hero-meta, .hero-cta, .hero-eyebrow, .hero-description',
		{
			y: 20,
			opacity: 0,
			stagger: 0.1,
			duration: 0.5
		},
		'-=0.4'
	);

	return tl;
}

/**
 * Scroll-triggered animations
 * Like ZETR: elements reveal as you scroll, creating a sense of discovery
 */
export function scrollAnimations(): void {
	// Section titles - words reveal with offset
	gsap.utils.toArray('.section-title').forEach((element) => {
		const title = element as HTMLElement;
		const words = splitText(title, 'words');

		gsap.from(words, {
			scrollTrigger: {
				trigger: title,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			},
			y: 40,
			opacity: 0,
			stagger: 0.05,
			duration: 0.6
		});
	});

	// Product cards - staggered reveal
	gsap.utils.toArray('.product-card').forEach((element, i) => {
		const card = element as HTMLElement;
		gsap.from(card, {
			scrollTrigger: {
				trigger: card,
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			},
			y: 60,
			opacity: 0,
			duration: 0.8,
			delay: (i % 3) * 0.1 // Stagger within row
		});
	});

	// Images - subtle scale on scroll
	gsap.utils.toArray('.reveal-image').forEach((element) => {
		const img = element as HTMLElement;
		gsap.from(img, {
			scrollTrigger: {
				trigger: img,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			},
			scale: 1.1,
			opacity: 0,
			duration: 1,
			ease: 'power2.out'
		});
	});

	// Parallax text (like ZETR's floating labels)
	gsap.utils.toArray('.parallax-text').forEach((element) => {
		const text = element as HTMLElement;
		gsap.to(text, {
			scrollTrigger: {
				trigger: text,
				start: 'top bottom',
				end: 'bottom top',
				scrub: 1
			},
			y: -100,
			ease: 'none'
		});
	});

	// Fade up elements
	gsap.utils.toArray('.fade-up').forEach((element) => {
		const el = element as HTMLElement;
		gsap.from(el, {
			scrollTrigger: {
				trigger: el,
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			},
			y: 30,
			opacity: 0,
			duration: 0.6
		});
	});
}

/**
 * Portal transition effect
 * When navigating to product detail or checkout
 */
export function portalTransition(
	origin: HTMLElement,
	onComplete?: () => void
): gsap.core.Timeline {
	// Create overlay using safe DOM methods
	const overlay = document.createElement('div');
	overlay.className = 'portal-overlay';

	const ring = document.createElement('div');
	ring.className = 'portal-ring';

	const fill = document.createElement('div');
	fill.className = 'portal-fill';

	overlay.appendChild(ring);
	overlay.appendChild(fill);
	document.body.appendChild(overlay);

	// Get origin position
	const rect = origin.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	// Set origin point
	overlay.style.setProperty('--origin-x', `${centerX}px`);
	overlay.style.setProperty('--origin-y', `${centerY}px`);

	ring.style.left = `${centerX}px`;
	ring.style.top = `${centerY}px`;

	const tl = gsap.timeline({
		onComplete: () => {
			overlay.remove();
			onComplete?.();
		}
	});

	// Animate ring expansion
	tl.to(ring, {
		scale: 3,
		opacity: 0,
		duration: 0.6,
		ease: 'power2.out'
	});

	// Animate fill expansion
	tl.to(
		fill,
		{
			clipPath: `circle(150% at ${centerX}px ${centerY}px)`,
			duration: 0.8,
			ease: 'power3.inOut'
		},
		0.1
	);

	// Scale down main content
	tl.to(
		'.main-content, main',
		{
			scale: 0.95,
			opacity: 0,
			duration: 0.4,
			ease: 'power2.in'
		},
		0
	);

	return tl;
}

/**
 * Button hover effect
 */
export function initButtonAnimations(): void {
	const buttons = document.querySelectorAll('.btn, button[class*="btn"]');

	buttons.forEach((btn) => {
		btn.addEventListener('mouseenter', () => {
			gsap.to(btn, {
				scale: 1.02,
				duration: 0.3,
				ease: 'power2.out'
			});
		});

		btn.addEventListener('mouseleave', () => {
			gsap.to(btn, {
				scale: 1,
				duration: 0.3,
				ease: 'power2.out'
			});
		});
	});
}

/**
 * Animated link underline effect
 */
export function initLinkAnimations(): void {
	const links = document.querySelectorAll('.animated-link');

	links.forEach((link) => {
		const underline = link.querySelector('.underline');
		if (!underline) return;

		link.addEventListener('mouseenter', () => {
			gsap.fromTo(
				underline,
				{ scaleX: 0, transformOrigin: 'left' },
				{ scaleX: 1, duration: 0.4, ease: 'power2.out' }
			);
		});

		link.addEventListener('mouseleave', () => {
			gsap.to(underline, {
				scaleX: 0,
				transformOrigin: 'right',
				duration: 0.4,
				ease: 'power2.out'
			});
		});
	});
}

/**
 * Number count animation (for prices, stats)
 */
export function animateNumber(
	element: HTMLElement,
	target: number,
	formatter?: (value: number) => string
): gsap.core.Tween {
	const obj = { value: 0 };

	return gsap.to(obj, {
		value: target,
		duration: 1,
		ease: 'power2.out',
		onUpdate: () => {
			const formatted = formatter
				? formatter(Math.round(obj.value))
				: Math.round(obj.value).toString();
			element.textContent = formatted;
		}
	});
}

/**
 * Master initialization function
 * Call this in onMount of main layout
 */
export function initAnimations(): void {
	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	if (prefersReducedMotion) {
		// Skip animations for users who prefer reduced motion
		return;
	}

	// Initialize all animation systems
	pageLoadAnimation();
	scrollAnimations();
	initButtonAnimations();
	initLinkAnimations();
}

/**
 * Cleanup function for SvelteKit navigation
 */
export function cleanupAnimations(): void {
	// Kill all ScrollTrigger instances
	ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

	// Kill all ongoing animations
	gsap.killTweensOf('*');
}

/**
 * Refresh ScrollTrigger after dynamic content changes
 */
export function refreshScrollTrigger(): void {
	ScrollTrigger.refresh();
}
