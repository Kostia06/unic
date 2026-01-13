<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { t } from '$utils/i18n';
	import { testimonials } from '$data/testimonials';
	import { onMount } from 'svelte';

	// State
	let scrollContainer: HTMLElement;
	let isVisible = $state(false);
	let isPaused = $state(false);

	// Sort testimonials by current language (prioritize current language)
	let sortedTestimonials = $derived(
		[...testimonials].sort((a, b) => {
			if (a.language === language.current && b.language !== language.current) return -1;
			if (a.language !== language.current && b.language === language.current) return 1;
			return 0;
		})
	);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (scrollContainer) {
			observer.observe(scrollContainer);
		}

		return () => observer.disconnect();
	});

	// Generate star rating
	function renderStars(rating: number): string {
		return '★'.repeat(rating) + '☆'.repeat(5 - rating);
	}
</script>

<section id="testimonials" class="testimonials">
	<!-- Section header -->
	<div class="testimonials__header" class:is-visible={isVisible}>
		<p class="testimonials__eyebrow">
			{language.current === 'es' ? 'Testimonios' : 'Testimonials'}
		</p>
		<h2 class="testimonials__title section-title">
			{t(language.current, 'testimonials.title')}
		</h2>
		<p class="testimonials__subtitle">
			{t(language.current, 'testimonials.subtitle')}
		</p>
	</div>

	<!-- Testimonials carousel -->
	<div
		bind:this={scrollContainer}
		class="testimonials__carousel"
		role="region"
		aria-label={language.current === 'es' ? 'Carrusel de testimonios' : 'Testimonials carousel'}
		onmouseenter={() => (isPaused = true)}
		onmouseleave={() => (isPaused = false)}
	>
		<!-- Gradient fade edges -->
		<div class="testimonials__fade testimonials__fade--left"></div>
		<div class="testimonials__fade testimonials__fade--right"></div>

		<!-- Scrollable container -->
		<div class="testimonials__scroll">
			<!-- Spacer for gradient -->
			<div class="testimonials__spacer"></div>

			{#each sortedTestimonials as testimonial, index (testimonial.id)}
				<article
					class="testimonial-card"
					class:is-visible={isVisible}
					style="--delay: {index * 0.1}s"
				>
					<!-- Quote icon -->
					<div class="testimonial-card__quote-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
							<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
						</svg>
					</div>

					<!-- Quote text -->
					<blockquote class="testimonial-card__quote">
						"{testimonial.quote}"
					</blockquote>

					<!-- Rating -->
					<div class="testimonial-card__rating">
						{renderStars(testimonial.rating)}
					</div>

					<!-- Divider -->
					<div class="testimonial-card__divider"></div>

					<!-- Author -->
					<div class="testimonial-card__author">
						<div class="testimonial-card__avatar">
							{testimonial.name.charAt(0)}
						</div>
						<div class="testimonial-card__info">
							<span class="testimonial-card__name">{testimonial.name}</span>
							<span class="testimonial-card__location">{testimonial.location}</span>
						</div>
					</div>

					<!-- Language indicator -->
					{#if testimonial.language !== language.current}
						<div class="testimonial-card__lang">
							{testimonial.language.toUpperCase()}
						</div>
					{/if}
				</article>
			{/each}

			<!-- Spacer for gradient -->
			<div class="testimonials__spacer"></div>
		</div>
	</div>

	<!-- Scroll hint for mobile -->
	<div class="testimonials__hint">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
		</svg>
		<span>{language.current === 'es' ? 'Desliza para ver mas' : 'Swipe to see more'}</span>
	</div>
</section>

<style>
	.testimonials {
		position: relative;
		padding: 6rem 0;
	}

	/* Header */
	.testimonials__header {
		text-align: center;
		max-width: 800px;
		margin: 0 auto 4rem;
		padding: 0 2rem;
		opacity: 0;
		transform: translateY(1rem);
		transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.testimonials__header.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.testimonials__eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--white-50);
		margin-bottom: 1rem;
	}

	.testimonials__title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 300;
		line-height: 1;
		color: var(--white-white);
		margin: 0 0 1rem;
	}

	.testimonials__subtitle {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--white-70);
		max-width: 500px;
		margin: 0 auto;
	}

	/* Carousel */
	.testimonials__carousel {
		position: relative;
	}

	.testimonials__fade {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 3rem;
		z-index: 10;
		pointer-events: none;
	}

	.testimonials__fade--left {
		left: 0;
		background: linear-gradient(to right, var(--navy-deepest, #001239), transparent);
	}

	.testimonials__fade--right {
		right: 0;
		background: linear-gradient(to left, var(--navy-deepest, #001239), transparent);
	}

	@media (min-width: 768px) {
		.testimonials__fade {
			width: 6rem;
		}
	}

	.testimonials__scroll {
		display: flex;
		gap: 1.5rem;
		overflow-x: auto;
		padding-bottom: 1rem;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		scroll-snap-type: x mandatory;
	}

	.testimonials__scroll::-webkit-scrollbar {
		display: none;
	}

	.testimonials__spacer {
		flex-shrink: 0;
		width: 1rem;
	}

	@media (min-width: 768px) {
		.testimonials__spacer {
			width: 3rem;
		}
	}

	/* Testimonial Card */
	.testimonial-card {
		position: relative;
		flex-shrink: 0;
		width: 320px;
		padding: 2rem;
		background: transparent;
		border: 1px solid var(--white-10);
		scroll-snap-align: center;
		opacity: 0;
		transform: translateY(2rem);
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay, 0s);
	}

	.testimonial-card.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.testimonial-card:hover {
		border-color: var(--accent-purple, #8b5cf6);
		box-shadow: 0 0 40px rgba(139, 92, 246, 0.1);
	}

	@media (min-width: 768px) {
		.testimonial-card {
			width: 380px;
		}
	}

	.testimonial-card__quote-icon {
		color: var(--white-10);
		margin-bottom: 1rem;
	}

	.testimonial-card__quote {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.125rem;
		font-style: italic;
		line-height: 1.6;
		color: var(--white-90);
		margin: 0 0 1.5rem;
	}

	.testimonial-card__rating {
		font-size: 0.875rem;
		letter-spacing: 0.1em;
		color: var(--accent-purple, #8b5cf6);
		margin-bottom: 1.5rem;
	}

	.testimonial-card__divider {
		height: 1px;
		background: var(--white-10);
		margin-bottom: 1.5rem;
	}

	.testimonial-card__author {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.testimonial-card__avatar {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--white-10);
		border: 1px solid var(--white-10);
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1rem;
		color: var(--accent-purple, #8b5cf6);
	}

	.testimonial-card__info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.testimonial-card__name {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--white-white);
	}

	.testimonial-card__location {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--white-50);
	}

	.testimonial-card__lang {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5625rem;
		letter-spacing: 0.15em;
		color: var(--white-30);
	}

	/* Scroll hint */
	.testimonials__hint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 2rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		color: var(--white-30);
	}

	@media (min-width: 768px) {
		.testimonials__hint {
			display: none;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.testimonials__header,
		.testimonial-card {
			transition: none;
		}
	}
</style>
