<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { t } from '$utils/i18n';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	// State for scroll animation
	let sectionRef: HTMLElement;
	let isVisible = $state(false);

	// Element refs for GSAP animations
	let imageWrapper: HTMLElement;
	let aboutImageEl: HTMLElement;
	let handmadeLabel: HTMLElement;
	let estBadge: HTMLElement;
	let contentWrapper: HTMLElement;
	let labelEl: HTMLElement;
	let titleEl: HTMLElement;
	let featureItem0: HTMLElement;
	let featureItem1: HTMLElement;
	let featureItem2: HTMLElement;
	let textEl0: HTMLElement;
	let textEl1: HTMLElement;
	let ctaEl: HTMLElement;

	// About image URL
	const aboutImageUrl = 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=1000&fit=crop';

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;

						if (!prefersReducedMotion) {
							// Trigger GSAP animations
							animateSection();
						}

						observer.disconnect();
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		// Parallax effect on scroll
		if (!prefersReducedMotion && aboutImageEl) {
			gsap.to(aboutImageEl, {
				yPercent: 20,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionRef,
					start: 'top bottom',
					end: 'bottom top',
					scrub: 1
				}
			});
		}

		return () => {
			observer.disconnect();
			ScrollTrigger.getAll().forEach(t => t.kill());
		};
	});

	function animateSection() {
		const tl = gsap.timeline({
			defaults: { ease: 'power3.out' }
		});

		// Image wrapper slides in
		tl.fromTo(imageWrapper,
			{ opacity: 0, x: -60, scale: 0.95 },
			{ opacity: 1, x: 0, scale: 1, duration: 1 },
			0
		);

		// Handmade label pops in
		tl.fromTo(handmadeLabel,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.6 },
			0.5
		);

		// EST badge scales and rotates in
		tl.fromTo(estBadge,
			{ opacity: 0, scale: 0.5, rotation: -180 },
			{ opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' },
			0.4
		);

		// Content wrapper slides in from right
		tl.fromTo(contentWrapper,
			{ opacity: 0, x: 60 },
			{ opacity: 1, x: 0, duration: 1 },
			0.15
		);

		// Label fades in
		tl.fromTo(labelEl,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.5 },
			0.4
		);

		// Title reveals with clip-path
		tl.fromTo(titleEl,
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, duration: 0.8 },
			0.5
		);

		// Text paragraphs stagger in
		const textElements = [textEl0, textEl1].filter(Boolean);
		if (textElements.length > 0) {
			tl.fromTo(textElements,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
				0.7
			);
		}

		// Feature items stagger with counter animation
		const features = [featureItem0, featureItem1, featureItem2].filter(Boolean);
		features.forEach((item, i) => {
			tl.fromTo(item,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.5 },
				0.9 + i * 0.1
			);
		});

		// CTA slides up
		tl.fromTo(ctaEl,
			{ opacity: 0, y: 20 },
			{ opacity: 1, y: 0, duration: 0.5 },
			1.2
		);
	}
</script>

<section id="nosotros" bind:this={sectionRef} class="about-section">
	<div class="about-grid">
		<!-- Left: Image -->
		<div class="about-image-wrapper" bind:this={imageWrapper}>
			<div class="about-image-inner">
				<img
					bind:this={aboutImageEl}
					src={aboutImageUrl}
					alt={language.current === 'es' ? 'Artesanía de joyería Fam Unic' : 'Fam Unic jewelry craftsmanship'}
					class="about-image"
					loading="lazy"
				/>
			</div>

			<!-- "Hecho a mano" label -->
			<div class="handmade-label" bind:this={handmadeLabel}>
				<span>Hecho a mano</span>
			</div>

			<!-- "EST. 2024" rotating badge -->
			<div class="est-badge" bind:this={estBadge}>
				<svg viewBox="0 0 100 100" class="badge-svg">
					<path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
					<text>
						<textPath href="#badge-circle" startOffset="0%">
							EST. 2024 • FAM UNIC • EST. 2024 • FAM UNIC •
						</textPath>
					</text>
				</svg>
			</div>

			<!-- Decorative corner -->
			<div class="image-corner" aria-hidden="true"></div>
		</div>

		<!-- Right: Content -->
		<div class="about-content" bind:this={contentWrapper}>
			<!-- Section Label -->
			<span class="about-label" bind:this={labelEl}>Quienes somos</span>

			<!-- Headline with script accent -->
			<h2 class="about-title" bind:this={titleEl}>
				Joyas
				<span class="title-script">artesanales</span>
				del corazon de Mexico
			</h2>

			<!-- Body Text -->
			<div class="about-text">
				{#each t(language.current, 'about.content').split('\n\n') as paragraph, index (index)}
					{#if index === 0}
						<p bind:this={textEl0}>{paragraph}</p>
					{:else if index === 1}
						<p bind:this={textEl1}>{paragraph}</p>
					{:else}
						<p>{paragraph}</p>
					{/if}
				{/each}
			</div>

			<!-- Feature icons row -->
			<div class="feature-row">
				<div class="feature-item" bind:this={featureItem0}>
					<div class="feature-value">100%</div>
					<div class="feature-label">
						{language.current === 'es' ? 'Artesanal' : 'Handcrafted'}
					</div>
				</div>
				<div class="feature-item" bind:this={featureItem1}>
					<div class="feature-value">925</div>
					<div class="feature-label">
						{language.current === 'es' ? 'Plata' : 'Silver'}
					</div>
				</div>
				<div class="feature-item" bind:this={featureItem2}>
					<div class="feature-value">MX</div>
					<div class="feature-label">
						{language.current === 'es' ? 'Origen' : 'Origin'}
					</div>
				</div>
			</div>

			<!-- CTA Link -->
			<a href="#contacto" class="about-cta" bind:this={ctaEl}>
				<span>Conoce nuestra historia</span>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	.about-section {
		width: 100%;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1fr;
		min-height: 80vh;
	}

	@media (min-width: 1024px) {
		.about-grid {
			grid-template-columns: 1fr 1fr;
			min-height: 100vh;
		}
	}

	/* Left: Image wrapper */
	.about-image-wrapper {
		position: relative;
		overflow: hidden;
		opacity: 0;
		transform: translateX(-40px);
		transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.about-image-inner {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.about-image {
		width: 100%;
		height: 100%;
		min-height: 400px;
		object-fit: cover;
	}

	@media (min-width: 1024px) {
		.about-image {
			min-height: 100%;
		}
	}

	/* Decorative corner */
	.image-corner {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 4rem;
		height: 4rem;
		border-right: 2px solid var(--accent-purple, #8b5cf6);
		border-bottom: 2px solid var(--accent-purple, #8b5cf6);
		opacity: 0.6;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.about-image-wrapper:hover .image-corner {
		width: 6rem;
		height: 6rem;
		opacity: 1;
	}

	/* "Hecho a mano" label */
	.handmade-label {
		position: absolute;
		bottom: 2rem;
		left: 2rem;
		padding: 0.5rem 1rem;
		background: var(--white, #ffffff);
		color: var(--navy-deepest, #001239);
	}

	.handmade-label span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	/* "EST. 2024" rotating badge */
	.est-badge {
		position: absolute;
		top: 2rem;
		right: 2rem;
		width: 80px;
		height: 80px;
		animation: badge-rotate 20s linear infinite;
	}

	.badge-svg {
		width: 100%;
		height: 100%;
	}

	.badge-svg text {
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		fill: var(--white, #ffffff);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	@keyframes badge-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Right: Content */
	.about-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 4rem 2rem;
		background: var(--navy-deep, #001a4d);
		opacity: 0;
		transform: translateX(40px);
		transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: 0.15s;
	}

	@media (min-width: 1024px) {
		.about-content {
			padding: 6rem 4rem;
		}
	}

	/* Label */
	.about-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		margin-bottom: 1.5rem;
	}

	/* Title */
	.about-title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 400;
		color: var(--white, #ffffff);
		line-height: 1.1;
		margin: 0 0 2rem;
	}

	.title-script {
		display: block;
		font-family: 'Pinyon Script', cursive;
		color: var(--accent-purple, #8b5cf6);
		font-size: 1.2em;
		margin: 0.25rem 0;
	}

	/* Body text */
	.about-text {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 500px;
		margin-bottom: 2.5rem;
	}

	.about-text p {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 1rem;
		line-height: 1.7;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		margin: 0;
	}

	/* Feature row */
	.feature-row {
		display: flex;
		gap: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
		margin-bottom: 2.5rem;
	}

	.feature-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.feature-value {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 2rem;
		color: var(--white, #ffffff);
	}

	.feature-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
	}

	/* CTA Link */
	.about-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--white, #ffffff);
		text-decoration: none;
		position: relative;
		transition: color 0.3s ease;
	}

	.about-cta::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 100%;
		height: 1px;
		background: var(--accent-purple, #8b5cf6);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.about-cta:hover::after {
		transform: scaleX(1);
	}

	.about-cta svg {
		transition: transform 0.3s ease;
	}

	.about-cta:hover svg {
		transform: translateX(4px);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.est-badge {
			animation: none;
		}

		.about-image-wrapper,
		.about-content {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
