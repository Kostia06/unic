<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	// Featured product data
	const heroImage = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=1000&fit=crop';
	const featuredProduct = {
		name: 'Collar Nebulosa',
		price: '$2,450'
	};

	// Element refs
	let heroSection: HTMLElement;
	let frameOuter: HTMLElement;
	let frameInner: HTMLElement;
	let brandVertical: HTMLElement;
	let eyebrow: HTMLElement;
	let titleLine1: HTMLElement;
	let titleLine2: HTMLElement;
	let titleAccent: HTMLElement;
	let description: HTMLElement;
	let ctaButton: HTMLElement;
	let imageContainer: HTMLElement;
	let productImage: HTMLElement;
	let productTag: HTMLElement;
	let decoStar1: HTMLElement;
	let decoStar2: HTMLElement;
	let decoLines: HTMLElement;
	let scrollCta: HTMLElement;

	function scrollToProducts() {
		const productsSection = document.querySelector('#productos');
		if (productsSection) {
			productsSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set([frameOuter, frameInner, brandVertical, eyebrow, titleLine1, titleLine2, titleAccent, description, ctaButton, imageContainer, productTag, decoStar1, decoStar2, decoLines, scrollCta], {
				opacity: 1,
				y: 0,
				x: 0,
				scale: 1,
				clipPath: 'inset(0% 0% 0% 0%)'
			});
			return;
		}

		// Set initial states
		gsap.set(frameOuter, { opacity: 0 });
		gsap.set(frameInner, { opacity: 0 });
		gsap.set(brandVertical, { opacity: 0, x: -30 });
		gsap.set(eyebrow, { opacity: 0, y: 20 });
		gsap.set(titleLine1, { opacity: 0, y: 80, skewY: 5 });
		gsap.set(titleLine2, { opacity: 0, y: 80, skewY: 5 });
		gsap.set(titleAccent, { opacity: 0, x: -40 });
		gsap.set(description, { opacity: 0, y: 30 });
		gsap.set(ctaButton, { opacity: 0, y: 20 });
		gsap.set(imageContainer, { clipPath: 'inset(100% 0% 0% 0%)' });
		gsap.set(productImage, { scale: 1.3 });
		gsap.set(productTag, { opacity: 0, x: 30 });
		gsap.set(decoStar1, { opacity: 0, scale: 0, rotation: -180 });
		gsap.set(decoStar2, { opacity: 0, scale: 0, rotation: 180 });
		gsap.set(decoLines, { opacity: 0 });
		gsap.set(scrollCta, { opacity: 0, y: 20 });

		// Animation timeline
		const tl = gsap.timeline({
			defaults: { ease: 'power3.out' }
		});

		tl
			// Frame appears
			.to(frameOuter, { opacity: 1, duration: 0.8 }, 0.2)
			.to(frameInner, { opacity: 1, duration: 0.8 }, 0.4)

			// Decorative elements
			.to(decoLines, { opacity: 1, duration: 1 }, 0.3)
			.to(decoStar1, { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }, 0.5)
			.to(decoStar2, { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }, 0.7)

			// Brand
			.to(brandVertical, { opacity: 1, x: 0, duration: 0.8 }, 0.4)

			// Eyebrow
			.to(eyebrow, { opacity: 1, y: 0, duration: 0.6 }, 0.5)

			// Title lines with dramatic entrance
			.to(titleLine1, { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }, 0.6)
			.to(titleLine2, { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }, 0.75)
			.to(titleAccent, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 1)

			// Description
			.to(description, { opacity: 1, y: 0, duration: 0.8 }, 1.1)

			// CTA
			.to(ctaButton, { opacity: 1, y: 0, duration: 0.7 }, 1.2)

			// Image reveal - dramatic curtain effect
			.to(imageContainer, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut' }, 0.6)
			.to(productImage, { scale: 1, duration: 1.8, ease: 'power2.out' }, 0.6)

			// Product tag
			.to(productTag, { opacity: 1, x: 0, duration: 0.7 }, 1.5)

			// Scroll CTA
			.to(scrollCta, { opacity: 1, y: 0, duration: 0.6 }, 1.6);

		// Continuous animations
		gsap.to(decoStar1, {
			rotation: 360,
			duration: 60,
			repeat: -1,
			ease: 'none'
		});

		gsap.to(decoStar2, {
			rotation: -360,
			duration: 80,
			repeat: -1,
			ease: 'none'
		});

		// Parallax on mouse move
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const x = (clientX / window.innerWidth - 0.5) * 2;
			const y = (clientY / window.innerHeight - 0.5) * 2;

			gsap.to(productImage, {
				x: x * 15,
				y: y * 10,
				duration: 1.2,
				ease: 'power2.out'
			});

			gsap.to(decoStar1, {
				x: x * -25,
				y: y * -20,
				duration: 1.5,
				ease: 'power2.out'
			});

			gsap.to(decoStar2, {
				x: x * 30,
				y: y * 25,
				duration: 1.8,
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
	<!-- Art Deco Frame -->
	<div class="hero-frame hero-frame--outer" bind:this={frameOuter}></div>
	<div class="hero-frame hero-frame--inner" bind:this={frameInner}></div>

	<!-- Decorative geometric lines -->
	<div class="deco-lines" bind:this={decoLines}>
		<div class="deco-line deco-line--1"></div>
		<div class="deco-line deco-line--2"></div>
		<div class="deco-line deco-line--3"></div>
		<div class="deco-line deco-line--4"></div>
	</div>

	<!-- Decorative stars -->
	<div class="deco-star deco-star--1" bind:this={decoStar1}>
		<svg viewBox="0 0 100 100" fill="none">
			<path d="M50 0 L53 47 L100 50 L53 53 L50 100 L47 53 L0 50 L47 47 Z" fill="currentColor"/>
			<circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="0.5" fill="none"/>
			<circle cx="50" cy="50" r="15" stroke="currentColor" stroke-width="0.5" fill="none"/>
		</svg>
	</div>

	<div class="deco-star deco-star--2" bind:this={decoStar2}>
		<svg viewBox="0 0 100 100" fill="none">
			<polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" stroke="currentColor" stroke-width="0.5" fill="none"/>
			<circle cx="50" cy="50" r="20" stroke="currentColor" stroke-width="0.5" fill="none"/>
		</svg>
	</div>

	<!-- Main Grid -->
	<div class="hero-grid">
		<!-- Left: Vertical Brand -->
		<div class="hero-brand" bind:this={brandVertical}>
			<span class="brand-text">FAM</span>
			<span class="brand-diamond"></span>
			<span class="brand-text">UNIC</span>
		</div>

		<!-- Center: Content -->
		<div class="hero-content">
			<div class="hero-eyebrow" bind:this={eyebrow}>
				<span class="eyebrow-line"></span>
				<span class="eyebrow-text">Colección 2025</span>
				<span class="eyebrow-line"></span>
			</div>

			<div class="hero-title">
				<h1>
					<span class="title-line title-line--1" bind:this={titleLine1}>Joyas</span>
					<span class="title-line title-line--2" bind:this={titleLine2}>del Cosmos</span>
				</h1>
				<p class="title-accent" bind:this={titleAccent}>— hecho a mano en México —</p>
			</div>

			<p class="hero-description" bind:this={description}>
				Piezas únicas inspiradas en la vastedad del universo.
				Cada joya cuenta una historia escrita en las estrellas.
			</p>

			<button class="hero-cta" bind:this={ctaButton} onclick={scrollToProducts}>
				<span class="cta-text">Explorar Colección</span>
				<span class="cta-icon">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</span>
			</button>
		</div>

		<!-- Right: Featured Image -->
		<div class="hero-image-wrapper">
			<div class="hero-image-container" bind:this={imageContainer}>
				<img
					bind:this={productImage}
					src={heroImage}
					alt="Featured: {featuredProduct.name}"
					class="hero-image"
				/>
				<div class="image-overlay"></div>
			</div>

			<div class="product-tag" bind:this={productTag}>
				<span class="tag-eyebrow">Destacado</span>
				<span class="tag-name">{featuredProduct.name}</span>
				<span class="tag-price">{featuredProduct.price}</span>
			</div>

			<!-- Corner ornaments -->
			<div class="corner-ornament corner-ornament--tl"></div>
			<div class="corner-ornament corner-ornament--br"></div>
		</div>
	</div>

	<!-- Scroll CTA -->
	<div class="scroll-cta" bind:this={scrollCta}>
		<span class="scroll-text">Descubrir</span>
		<div class="scroll-line">
			<span class="scroll-dot"></span>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		height: 100vh;
		height: 100dvh;
		min-height: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		overflow: hidden;
		background:
			radial-gradient(ellipse 60% 50% at 70% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
			radial-gradient(ellipse 50% 60% at 20% 70%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
			var(--navy-deepest, #001239);
	}

	@media (min-width: 768px) {
		.hero {
			padding: 2rem;
		}
	}

	/* ═══════════════════════════════════════════════════════════════════
	   ART DECO FRAME
	   ═══════════════════════════════════════════════════════════════════ */

	.hero-frame {
		position: absolute;
		pointer-events: none;
	}

	.hero-frame--outer {
		inset: 1rem;
		border: 1px solid var(--purple-20, rgba(139, 92, 246, 0.2));
	}

	.hero-frame--inner {
		inset: 1.5rem;
		border: 1px solid var(--purple-10, rgba(139, 92, 246, 0.1));
	}

	@media (min-width: 768px) {
		.hero-frame--outer {
			inset: 1.5rem;
		}
		.hero-frame--inner {
			inset: 2rem;
		}
	}

	/* ═══════════════════════════════════════════════════════════════════
	   DECORATIVE LINES
	   ═══════════════════════════════════════════════════════════════════ */

	.deco-lines {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.deco-line {
		position: absolute;
		background: linear-gradient(to bottom, transparent, var(--purple-10, rgba(139, 92, 246, 0.1)), transparent);
	}

	.deco-line--1 {
		left: 15%;
		top: 0;
		bottom: 0;
		width: 1px;
	}

	.deco-line--2 {
		right: 15%;
		top: 0;
		bottom: 0;
		width: 1px;
	}

	.deco-line--3 {
		top: 20%;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(to right, transparent, var(--purple-10, rgba(139, 92, 246, 0.1)), transparent);
	}

	.deco-line--4 {
		bottom: 20%;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(to right, transparent, var(--purple-10, rgba(139, 92, 246, 0.1)), transparent);
	}

	/* ═══════════════════════════════════════════════════════════════════
	   DECORATIVE STARS
	   ═══════════════════════════════════════════════════════════════════ */

	.deco-star {
		position: absolute;
		pointer-events: none;
		color: var(--purple, #8b5cf6);
	}

	.deco-star--1 {
		top: 8%;
		right: 10%;
		width: 120px;
		height: 120px;
		opacity: 0.2;
	}

	.deco-star--2 {
		bottom: 15%;
		left: 8%;
		width: 80px;
		height: 80px;
		opacity: 0.15;
	}

	.deco-star svg {
		width: 100%;
		height: 100%;
	}

	/* ═══════════════════════════════════════════════════════════════════
	   MAIN GRID
	   ═══════════════════════════════════════════════════════════════════ */

	.hero-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		max-width: 1300px;
		width: 100%;
		align-items: center;
		padding: 3rem 1rem;
	}

	@media (min-width: 1024px) {
		.hero-grid {
			grid-template-columns: auto 1fr 1fr;
			gap: 4rem;
			padding: 0 2rem;
		}
	}

	/* ═══════════════════════════════════════════════════════════════════
	   VERTICAL BRAND
	   ═══════════════════════════════════════════════════════════════════ */

	.hero-brand {
		display: none;
	}

	@media (min-width: 1024px) {
		.hero-brand {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			writing-mode: vertical-rl;
			text-orientation: mixed;
			transform: rotate(180deg);
		}
	}

	.brand-text {
		font-family: var(--font-display, 'Bodoni Moda', serif);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.4em;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
	}

	.brand-diamond {
		width: 6px;
		height: 6px;
		background: var(--purple, #8b5cf6);
		transform: rotate(45deg);
		flex-shrink: 0;
	}

	/* ═══════════════════════════════════════════════════════════════════
	   CONTENT
	   ═══════════════════════════════════════════════════════════════════ */

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
	}

	/* Eyebrow */
	.hero-eyebrow {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.eyebrow-line {
		width: 30px;
		height: 1px;
		background: var(--purple, #8b5cf6);
	}

	.eyebrow-text {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.6875rem;
		font-weight: 400;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--purple-light, #a78bfa);
	}

	/* Title */
	.hero-title {
		margin-bottom: 2rem;
	}

	.hero-title h1 {
		display: flex;
		flex-direction: column;
		margin: 0;
	}

	.title-line {
		display: block;
		font-family: var(--font-display, 'Bodoni Moda', serif);
		font-weight: 400;
		line-height: 0.9;
		color: var(--white, #ffffff);
	}

	.title-line--1 {
		font-size: clamp(3.5rem, 12vw, 8rem);
		letter-spacing: -0.03em;
	}

	.title-line--2 {
		font-size: clamp(2.5rem, 8vw, 5.5rem);
		letter-spacing: -0.02em;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
	}

	.title-accent {
		font-family: var(--font-elegant, 'Cormorant Garamond', serif);
		font-size: clamp(1rem, 2vw, 1.25rem);
		font-style: italic;
		font-weight: 300;
		color: var(--purple-light, #a78bfa);
		margin: 0.75rem 0 0 0;
		letter-spacing: 0.05em;
	}

	/* Description */
	.hero-description {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.9375rem;
		font-weight: 300;
		line-height: 1.8;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		max-width: 380px;
		margin-bottom: 2.5rem;
	}

	/* CTA Button */
	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 2rem;
		background: transparent;
		border: 1px solid var(--purple, #8b5cf6);
		color: var(--purple-light, #a78bfa);
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-cta::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--purple, #8b5cf6);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		z-index: 0;
	}

	.hero-cta:hover::before {
		transform: scaleX(1);
	}

	.hero-cta:hover {
		color: var(--white, #ffffff);
	}

	.cta-text {
		position: relative;
		z-index: 1;
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.cta-icon {
		position: relative;
		z-index: 1;
		display: flex;
		transition: transform 0.4s ease;
	}

	.hero-cta:hover .cta-icon {
		transform: translateX(4px);
	}

	/* ═══════════════════════════════════════════════════════════════════
	   IMAGE SECTION
	   ═══════════════════════════════════════════════════════════════════ */

	.hero-image-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.hero-image-container {
		position: relative;
		width: 100%;
		max-width: 350px;
		aspect-ratio: 3/4;
		overflow: hidden;
	}

	@media (min-width: 1024px) {
		.hero-image-container {
			max-width: 400px;
		}
	}

	.hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 60%,
			rgba(0, 18, 57, 0.4) 100%
		);
		pointer-events: none;
	}

	/* Product Tag */
	.product-tag {
		position: absolute;
		bottom: -1rem;
		right: -0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1.25rem 1.5rem;
		background: var(--white, #ffffff);
		color: var(--navy-deepest, #001239);
	}

	@media (min-width: 1024px) {
		.product-tag {
			right: -1.5rem;
		}
	}

	.tag-eyebrow {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.5625rem;
		font-weight: 400;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--purple, #8b5cf6);
	}

	.tag-name {
		font-family: var(--font-display, 'Bodoni Moda', serif);
		font-size: 1.125rem;
		font-weight: 400;
	}

	.tag-price {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.875rem;
		font-weight: 300;
		color: var(--navy-medium, #002266);
	}

	/* Corner Ornaments */
	.corner-ornament {
		position: absolute;
		width: 2rem;
		height: 2rem;
		pointer-events: none;
	}

	.corner-ornament::before,
	.corner-ornament::after {
		content: '';
		position: absolute;
		background: var(--purple, #8b5cf6);
	}

	.corner-ornament::before {
		width: 100%;
		height: 1px;
	}

	.corner-ornament::after {
		width: 1px;
		height: 100%;
	}

	.corner-ornament--tl {
		top: -0.5rem;
		left: -0.5rem;
	}

	.corner-ornament--tl::before {
		top: 0;
		left: 0;
	}

	.corner-ornament--tl::after {
		top: 0;
		left: 0;
	}

	.corner-ornament--br {
		bottom: 1.5rem;
		right: 1rem;
	}

	@media (min-width: 1024px) {
		.corner-ornament--br {
			right: 0;
		}
	}

	.corner-ornament--br::before {
		bottom: 0;
		right: 0;
	}

	.corner-ornament--br::after {
		bottom: 0;
		right: 0;
	}

	/* ═══════════════════════════════════════════════════════════════════
	   SCROLL CTA
	   ═══════════════════════════════════════════════════════════════════ */

	.scroll-cta {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: none;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	@media (min-height: 700px) {
		.scroll-cta {
			display: flex;
		}
	}

	.scroll-text {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.625rem;
		font-weight: 400;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--white-30, rgba(255, 255, 255, 0.3));
	}

	.scroll-line {
		width: 1px;
		height: 50px;
		background: linear-gradient(to bottom, var(--purple-30, rgba(139, 92, 246, 0.3)), transparent);
		position: relative;
	}

	.scroll-dot {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 4px;
		background: var(--purple, #8b5cf6);
		border-radius: 50%;
		animation: scroll-pulse 2s ease-in-out infinite;
	}

	@keyframes scroll-pulse {
		0%, 100% {
			top: 0;
			opacity: 1;
		}
		50% {
			top: 100%;
			opacity: 0;
		}
	}

	/* ═══════════════════════════════════════════════════════════════════
	   REDUCED MOTION
	   ═══════════════════════════════════════════════════════════════════ */

	@media (prefers-reduced-motion: reduce) {
		.deco-star,
		.scroll-dot {
			animation: none;
		}

		.hero-cta::before {
			transition: none;
		}
	}
</style>
