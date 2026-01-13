<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import VerticalBrand from '$lib/components/ui/VerticalBrand.svelte';

	// Featured product data
	const heroImage = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop';
	const featuredProduct = {
		name: 'Collar Nebulosa',
		price: '$2,450'
	};

	// Element refs for animations
	let heroSection: HTMLElement;
	let eyebrow: HTMLElement;
	let eyebrowLine: HTMLElement;
	let mainTitle: HTMLElement;
	let scriptAccent: HTMLElement;
	let description: HTMLElement;
	let ctaButton: HTMLElement;
	let productWrapper: HTMLElement;
	let productImage: HTMLElement;
	let productGlow: HTMLElement;
	let productTag: HTMLElement;
	let decorativeSpiral: HTMLElement;
	let decorativeSpiral2: HTMLElement;
	let floatingParticles: HTMLElement[] = [];
	let scrollIndicator: HTMLElement;
	let particle1: HTMLElement;
	let particle2: HTMLElement;
	let particle3: HTMLElement;
	let particle4: HTMLElement;
	let particle5: HTMLElement;

	function scrollToProducts() {
		const productsSection = document.querySelector('#productos');
		if (productsSection) {
			productsSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set([eyebrow, eyebrowLine, mainTitle, scriptAccent, description, ctaButton, productWrapper, productTag, decorativeSpiral, decorativeSpiral2, scrollIndicator], {
				opacity: 1,
				y: 0,
				x: 0,
				scale: 1
			});
			return;
		}

		// Create entrance timeline
		const tl = gsap.timeline({
			defaults: {
				ease: 'power3.out',
				duration: 0.8
			}
		});

		// Set initial states
		gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: 'left center' });
		gsap.set(eyebrow, { opacity: 0, x: -20 });
		gsap.set(mainTitle, { opacity: 0, y: 60, skewY: 3 });
		gsap.set(scriptAccent, { opacity: 0, x: -30, rotation: -5 });
		gsap.set(description, { opacity: 0, y: 30 });
		gsap.set(ctaButton, { opacity: 0, y: 20, scale: 0.95 });
		gsap.set(productWrapper, { opacity: 0, scale: 0.85, rotation: -5 });
		gsap.set(productGlow, { opacity: 0, scale: 0.3 });
		gsap.set(productTag, { opacity: 0, x: 30, y: 10 });
		gsap.set(decorativeSpiral, { opacity: 0, scale: 0.3, rotation: -180 });
		gsap.set(decorativeSpiral2, { opacity: 0, scale: 0.3, rotation: 180 });
		gsap.set(scrollIndicator, { opacity: 0, y: -20 });

		// Set floating particles initial state
		const particles = [particle1, particle2, particle3, particle4, particle5].filter(Boolean);
		particles.forEach(p => {
			gsap.set(p, { opacity: 0, scale: 0 });
		});

		// Animation sequence - more dramatic timing
		tl
			// Eyebrow line draws first
			.to(eyebrowLine, {
				scaleX: 1,
				duration: 0.8,
				ease: 'power2.inOut'
			}, 0.2)

			// Eyebrow text slides in
			.to(eyebrow, {
				opacity: 1,
				x: 0,
				duration: 0.6
			}, 0.4)

			// Main title - dramatic entrance with skew
			.to(mainTitle, {
				opacity: 1,
				y: 0,
				skewY: 0,
				duration: 1.2,
				ease: 'power4.out'
			}, 0.5)

			// Script accent - elegant slide with rotation
			.to(scriptAccent, {
				opacity: 1,
				x: 0,
				rotation: 0,
				duration: 1,
				ease: 'elastic.out(1, 0.8)'
			}, 0.9)

			// Description fades up with stagger
			.to(description, {
				opacity: 1,
				y: 0,
				duration: 0.8
			}, 1.1)

			// CTA button - scale and fade
			.to(ctaButton, {
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.7,
				ease: 'back.out(1.5)'
			}, 1.3)

			// Product wrapper - dramatic scale and rotation
			.to(productWrapper, {
				opacity: 1,
				scale: 1,
				rotation: 0,
				duration: 1.4,
				ease: 'power3.out'
			}, 0.6)

			// Product glow expands dramatically
			.to(productGlow, {
				opacity: 1,
				scale: 1,
				duration: 2,
				ease: 'power2.out'
			}, 0.8)

			// Product tag slides in
			.to(productTag, {
				opacity: 1,
				x: 0,
				y: 0,
				duration: 0.7,
				ease: 'power2.out'
			}, 1.5)

			// Decorative spirals spin in from opposite directions
			.to(decorativeSpiral, {
				opacity: 0.6,
				scale: 1,
				rotation: 0,
				duration: 1.2,
				ease: 'back.out(1.7)'
			}, 1.0)

			.to(decorativeSpiral2, {
				opacity: 0.4,
				scale: 1,
				rotation: 0,
				duration: 1.2,
				ease: 'back.out(1.7)'
			}, 1.2)

			// Scroll indicator appears last
			.to(scrollIndicator, {
				opacity: 1,
				y: 0,
				duration: 0.6
			}, 1.8);

		// Floating particles animation
		if (particles.length > 0) {
			particles.forEach((p, i) => {
				tl.to(p, {
					opacity: 0.6,
					scale: 1,
					duration: 0.5,
					ease: 'back.out(2)'
				}, 1.2 + i * 0.1);

				// Continuous floating animation
				gsap.to(p, {
					y: `random(-30, 30)`,
					x: `random(-20, 20)`,
					duration: 3 + Math.random() * 2,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: i * 0.2
				});
			});
		}

		// Continuous rotation for spirals
		gsap.to(decorativeSpiral, {
			rotation: 360,
			duration: 40,
			repeat: -1,
			ease: 'none'
		});

		gsap.to(decorativeSpiral2, {
			rotation: -360,
			duration: 50,
			repeat: -1,
			ease: 'none'
		});

		// Scroll indicator bounce animation
		gsap.to(scrollIndicator, {
			y: 10,
			duration: 1.5,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut',
			delay: 2.5
		});

		// Parallax effect on mouse move
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const x = (clientX / window.innerWidth - 0.5) * 2;
			const y = (clientY / window.innerHeight - 0.5) * 2;

			gsap.to(productWrapper, {
				x: x * 20,
				y: y * 15,
				rotation: x * 2,
				duration: 1,
				ease: 'power2.out'
			});

			gsap.to(decorativeSpiral, {
				x: x * -30,
				y: y * -20,
				duration: 1.2,
				ease: 'power2.out'
			});

			gsap.to(decorativeSpiral2, {
				x: x * 40,
				y: y * 25,
				duration: 1.5,
				ease: 'power2.out'
			});
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			tl.kill();
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<section class="hero" bind:this={heroSection}>
	<!-- Decorative rotating spirals -->
	<div class="decorative-spiral decorative-spiral--1" bind:this={decorativeSpiral}>
		<svg viewBox="0 0 100 100" fill="none">
			<path d="M50 10 Q90 50 50 90 Q10 50 50 10" stroke="currentColor" stroke-width="0.5" fill="none"/>
			<circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="0.5" fill="none"/>
			<circle cx="50" cy="50" r="20" stroke="currentColor" stroke-width="0.5" fill="none"/>
			<circle cx="50" cy="50" r="8" stroke="currentColor" stroke-width="0.5" fill="none"/>
		</svg>
	</div>

	<div class="decorative-spiral decorative-spiral--2" bind:this={decorativeSpiral2}>
		<svg viewBox="0 0 100 100" fill="none">
			<path d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z" stroke="currentColor" stroke-width="0.3" fill="none"/>
			<circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="0.3" fill="none"/>
		</svg>
	</div>

	<!-- Floating particles -->
	<div class="floating-particles">
		<div class="particle particle--1" bind:this={particle1}></div>
		<div class="particle particle--2" bind:this={particle2}></div>
		<div class="particle particle--3" bind:this={particle3}></div>
		<div class="particle particle--4" bind:this={particle4}></div>
		<div class="particle particle--5" bind:this={particle5}></div>
	</div>

	<!-- Main 3-column grid -->
	<div class="hero__grid">
		<!-- Left column - Vertical brand -->
		<div class="hero__brand">
			<VerticalBrand />
		</div>

		<!-- Center column - Content -->
		<div class="hero__content">
			<div class="hero-eyebrow-wrapper">
				<div class="hero-eyebrow-line" bind:this={eyebrowLine}></div>
				<div class="hero-eyebrow" bind:this={eyebrow}>
					<span>Coleccion 2025</span>
				</div>
			</div>

			<div class="hero-title">
				<h1 class="hero__main-title" bind:this={mainTitle}>Joyas</h1>
				<p class="hero__script-accent" bind:this={scriptAccent}>del universo</p>
			</div>

			<p class="hero-description" bind:this={description}>
				Piezas unicas inspiradas en la vastedad del cosmos.
				Cada joya cuenta una historia escrita en las estrellas,
				creada con maestria artesanal y materiales celestiales.
			</p>

			<button class="hero-cta" bind:this={ctaButton} onclick={scrollToProducts}>
				<span>Explorar coleccion</span>
				<svg class="hero-cta__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>

		<!-- Right column - Featured product -->
		<div class="hero__product-wrapper" bind:this={productWrapper}>
			<div class="hero-product">
				<div class="hero-product__glow" bind:this={productGlow}></div>
				<div class="hero-product__ring"></div>
				<img
					bind:this={productImage}
					src={heroImage}
					alt="Featured cosmic jewelry - {featuredProduct.name}"
					class="hero-product__image"
				/>
			</div>

			<div class="hero-product__tag" bind:this={productTag}>
				<span class="tag-label">Destacado</span>
				<span class="tag-name">{featuredProduct.name}</span>
				<span class="tag-price">{featuredProduct.price}</span>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="scroll-indicator" bind:this={scrollIndicator}>
		<span class="scroll-text">Scroll</span>
		<div class="scroll-line">
			<div class="scroll-dot"></div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		height: 100vh;
		height: 100dvh; /* Dynamic viewport height for mobile */
		min-height: 600px; /* Minimum for very short screens */
		max-height: 100vh;
		max-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5rem 1.5rem 3rem;
		overflow: hidden;
		box-sizing: border-box;
	}

	@media (min-width: 768px) {
		.hero {
			padding: 6rem 2rem 4rem;
		}
	}

	@media (min-width: 1024px) {
		.hero {
			padding: 4rem 3rem;
		}
	}

	/* Decorative rotating spirals */
	.decorative-spiral {
		position: absolute;
		pointer-events: none;
	}

	.decorative-spiral--1 {
		top: 12%;
		right: 8%;
		width: 150px;
		height: 150px;
		color: var(--accent-purple, #8b5cf6);
		opacity: 0.15;
	}

	.decorative-spiral--2 {
		bottom: 15%;
		left: 5%;
		width: 100px;
		height: 100px;
		color: var(--accent-pink, #ec4899);
		opacity: 0.1;
	}

	.decorative-spiral svg {
		width: 100%;
		height: 100%;
	}

	/* Floating particles */
	.floating-particles {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.particle {
		position: absolute;
		border-radius: 50%;
		background: var(--accent-purple, #8b5cf6);
	}

	.particle--1 {
		width: 6px;
		height: 6px;
		top: 20%;
		left: 15%;
	}

	.particle--2 {
		width: 4px;
		height: 4px;
		top: 35%;
		right: 20%;
		background: var(--accent-pink, #ec4899);
	}

	.particle--3 {
		width: 8px;
		height: 8px;
		bottom: 30%;
		left: 25%;
	}

	.particle--4 {
		width: 5px;
		height: 5px;
		top: 60%;
		right: 30%;
		background: var(--accent-gold, #fbbf24);
	}

	.particle--5 {
		width: 3px;
		height: 3px;
		bottom: 20%;
		right: 15%;
	}

	/* Eyebrow wrapper with animated line */
	.hero-eyebrow-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.hero-eyebrow-wrapper {
			gap: 1rem;
			margin-bottom: 1.5rem;
		}
	}

	.hero-eyebrow-line {
		width: 40px;
		height: 1px;
		background: var(--accent-purple, #8b5cf6);
	}

	/* Main 3-column grid */
	.hero__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		max-width: 1400px;
		width: 100%;
		height: 100%;
		max-height: calc(100dvh - 8rem);
		margin: 0 auto;
		align-content: center;
	}

	@media (min-width: 768px) {
		.hero__grid {
			gap: 2rem;
		}
	}

	@media (min-width: 1024px) {
		.hero__grid {
			grid-template-columns: auto 1fr auto;
			gap: 3rem;
			align-items: center;
			max-height: none;
		}
	}

	@media (min-width: 1280px) {
		.hero__grid {
			gap: 4rem;
		}
	}

	/* Left column - Vertical brand */
	.hero__brand {
		display: none;
	}

	@media (min-width: 1024px) {
		.hero__brand {
			display: flex;
			justify-content: center;
			padding-left: 2rem;
		}
	}

	/* Center column - Content */
	.hero__content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
	}

	/* Eyebrow */
	.hero-eyebrow {
		display: inline-flex;
	}

	.hero-eyebrow span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
	}

	/* Title wrapper */
	.hero-title {
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.hero-title {
			margin-bottom: 1.5rem;
		}
	}

	/* Main title */
	.hero__main-title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(3rem, 10vw, 7rem);
		font-weight: 400;
		line-height: 0.9;
		color: var(--white, #ffffff);
		margin: 0;
	}

	@media (min-height: 800px) {
		.hero__main-title {
			font-size: clamp(4rem, 12vw, 8rem);
		}
	}

	/* Script accent */
	.hero__script-accent {
		font-family: 'Pinyon Script', cursive;
		font-size: clamp(1.5rem, 4vw, 3rem);
		color: var(--accent-purple, #8b5cf6);
		text-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);
		margin: 0;
		margin-left: 0.5rem;
		margin-top: 0.25rem;
	}

	@media (min-width: 768px) {
		.hero__script-accent {
			font-size: clamp(2rem, 5vw, 3.5rem);
			margin-left: 1rem;
			margin-top: 0.5rem;
		}
	}

	/* Description */
	.hero-description {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	@media (min-width: 768px) {
		.hero-description {
			font-size: 1rem;
			line-height: 1.7;
			margin-bottom: 2rem;
		}
	}

	/* CTA Button */
	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid var(--white-30, rgba(255, 255, 255, 0.3));
		color: var(--white, #ffffff);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@media (min-width: 768px) {
		.hero-cta {
			gap: 0.75rem;
			padding: 1rem 2rem;
			font-size: 0.75rem;
		}
	}

	.hero-cta:hover {
		background: var(--white, #ffffff);
		color: var(--navy-deepest, #001239);
		border-color: var(--white, #ffffff);
	}

	.hero-cta__arrow {
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-cta:hover .hero-cta__arrow {
		transform: translateX(4px);
	}

	/* Right column - Product */
	.hero__product-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.hero-product {
		position: relative;
		width: 100%;
		max-width: min(280px, 45vw);
		aspect-ratio: 1;
	}

	@media (min-width: 768px) {
		.hero-product {
			max-width: min(320px, 40vw);
		}
	}

	@media (min-width: 1024px) {
		.hero-product {
			max-width: min(350px, 25vw);
		}
	}

	@media (min-height: 800px) and (min-width: 1024px) {
		.hero-product {
			max-width: 400px;
		}
	}

	.hero-product__glow {
		position: absolute;
		inset: -20%;
		background: radial-gradient(
			circle at center,
			rgba(139, 92, 246, 0.2) 0%,
			rgba(139, 92, 246, 0.05) 40%,
			transparent 70%
		);
		pointer-events: none;
	}

	.hero-product__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		animation: product-float 6s ease-in-out infinite;
	}

	@keyframes product-float {
		0%, 100% {
			transform: translateY(0) rotate(-2deg);
		}
		50% {
			transform: translateY(-20px) rotate(2deg);
		}
	}

	/* Product tag */
	.hero-product__tag {
		position: absolute;
		bottom: -1rem;
		right: -1rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		padding: 1rem 1.5rem;
		background: var(--white, #ffffff);
		color: var(--navy-deepest, #001239);
	}

	.tag-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5625rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent-purple, #8b5cf6);
	}

	.tag-name {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1rem;
		font-weight: 500;
	}

	.tag-price {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
	}

	/* Product ring decoration */
	.hero-product__ring {
		position: absolute;
		inset: -10%;
		border: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
		border-radius: 50%;
		animation: ring-rotate 20s linear infinite;
	}

	.hero-product__ring::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 8px;
		height: 8px;
		background: var(--accent-purple, #8b5cf6);
		border-radius: 50%;
	}

	@keyframes ring-rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Scroll indicator */
	.scroll-indicator {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		display: none;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	@media (min-height: 700px) {
		.scroll-indicator {
			display: flex;
			bottom: 1.5rem;
		}
	}

	@media (min-height: 800px) {
		.scroll-indicator {
			bottom: 2rem;
		}
	}

	.scroll-text {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--white-30, rgba(255, 255, 255, 0.3));
	}

	.scroll-line {
		width: 1px;
		height: 40px;
		background: linear-gradient(to bottom, var(--white-30, rgba(255, 255, 255, 0.3)), transparent);
		position: relative;
	}

	.scroll-dot {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 4px;
		background: var(--accent-purple, #8b5cf6);
		border-radius: 50%;
		animation: scroll-dot 2s ease-in-out infinite;
	}

	@keyframes scroll-dot {
		0%, 100% { top: 0; opacity: 1; }
		50% { top: 100%; opacity: 0; }
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.hero-product__image,
		.hero-product__ring,
		.scroll-dot {
			animation: none;
		}

		.decorative-spiral {
			animation: none;
		}

		.particle {
			animation: none;
		}
	}
</style>
