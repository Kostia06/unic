<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Hero from '$components/home/Hero.svelte';
	import ProductGrid from '$components/home/ProductGrid.svelte';
	import Testimonials from '$components/home/Testimonials.svelte';
	import Contact from '$components/home/Contact.svelte';
	import MarqueeBanner from '$components/ui/MarqueeBanner.svelte';
	import { language } from '$stores/language.svelte';

	// Section refs for scroll animations
	let productsSection: HTMLElement;
	let testimonialsSection: HTMLElement;
	let contactSection: HTMLElement;
	let marquee1: HTMLElement;
	let marquee2: HTMLElement;

	onMount(() => {
		// Register ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		// Products section animation
		gsap.fromTo(productsSection,
			{ opacity: 0, y: 80 },
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: productsSection,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		// Testimonials section - fade up with scale
		gsap.fromTo(testimonialsSection,
			{ opacity: 0, y: 60, scale: 0.98 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: testimonialsSection,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		// Contact section - dramatic entrance
		gsap.fromTo(contactSection,
			{ opacity: 0, y: 80, rotateX: 5 },
			{
				opacity: 1,
				y: 0,
				rotateX: 0,
				duration: 1.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: contactSection,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		// Marquee banners - slide in
		gsap.fromTo(marquee1,
			{ opacity: 0, scaleX: 0.8 },
			{
				opacity: 1,
				scaleX: 1,
				duration: 0.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: marquee1,
					start: 'top 95%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		gsap.fromTo(marquee2,
			{ opacity: 0, scaleX: 0.8 },
			{
				opacity: 1,
				scaleX: 1,
				duration: 0.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: marquee2,
					start: 'top 95%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	});
</script>

<svelte:head>
	<meta name="description" content="Fam Unic - Joyas del universo, hechas para ti. Joyería artesanal mexicana con inspiración cósmica." />
</svelte:head>

<!-- Hero Section -->
<Hero />

<!-- Announcement Banner -->
<div bind:this={marquee1} class="marquee-wrapper">
	<MarqueeBanner
		text={language.current === 'es' ? 'ENVÍO GRATIS EN PEDIDOS +$999 MXN' : 'FREE SHIPPING ON ORDERS +$999 MXN'}
		speed={25}
		separator="✦"
	/>
</div>

<!-- Products Section -->
<section id="productos" class="section-padding scroll-section" bind:this={productsSection}>
	<ProductGrid />
</section>

<!-- Testimonials Section -->
<section id="testimonials" class="section-padding scroll-section" bind:this={testimonialsSection}>
	<Testimonials />
</section>

<!-- Second Marquee Banner -->
<div bind:this={marquee2} class="marquee-wrapper">
	<MarqueeBanner
		text={language.current === 'es' ? 'HECHO A MANO EN MÉXICO' : 'HANDMADE IN MEXICO'}
		speed={30}
		direction="right"
		separator="★"
	/>
</div>

<!-- Contact Section -->
<section id="contacto" class="section-padding scroll-section" bind:this={contactSection}>
	<Contact />
</section>

<style>
	.scroll-section {
		will-change: transform, opacity;
	}

	.marquee-wrapper {
		will-change: transform, opacity;
	}
</style>
