<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { t } from '$utils/i18n';
	import { mockFaqs } from '$data/products';
	import { onMount } from 'svelte';

	// State
	let openFaqId = $state<string | null>(null);
	let isVisible = $state(false);
	let sectionRef: HTMLElement;

	// Get localized question/answer
	function getQuestion(faq: (typeof mockFaqs)[0]): string {
		return language.current === 'en' && faq.question_en ? faq.question_en : faq.question_es;
	}

	function getAnswer(faq: (typeof mockFaqs)[0]): string {
		return language.current === 'en' && faq.answer_en ? faq.answer_en : faq.answer_es;
	}

	function toggleFaq(id: string) {
		openFaqId = openFaqId === id ? null : id;
	}

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

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		return () => observer.disconnect();
	});
</script>

<section id="faq" bind:this={sectionRef} class="faq">
	<div class="faq__container">
		<!-- Section header -->
		<div class="faq__header" class:is-visible={isVisible}>
			<p class="faq__eyebrow">
				{language.current === 'es' ? 'Preguntas Frecuentes' : 'FAQ'}
			</p>
			<h2 class="faq__title section-title">
				{t(language.current, 'faq.title')}
			</h2>
			<p class="faq__subtitle">
				{t(language.current, 'faq.subtitle')}
			</p>
		</div>

		<!-- FAQ list -->
		<div class="faq__list">
			{#each mockFaqs.filter((f) => f.is_active) as faq, index (faq.id)}
				{@const isOpen = openFaqId === faq.id}
				<div
					class="faq-item"
					class:is-visible={isVisible}
					class:is-open={isOpen}
					style="--delay: {index * 0.1}s"
				>
					<!-- Question button -->
					<button
						onclick={() => toggleFaq(faq.id)}
						class="faq-item__question"
						aria-expanded={isOpen}
						aria-controls="faq-answer-{faq.id}"
					>
						<span class="faq-item__question-text">{getQuestion(faq)}</span>
						<span class="faq-item__icon" class:is-open={isOpen}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
								<line x1="8" y1="3" x2="8" y2="13" class="faq-item__icon-vertical" />
								<line x1="3" y1="8" x2="13" y2="8" />
							</svg>
						</span>
					</button>

					<!-- Answer -->
					<div
						id="faq-answer-{faq.id}"
						class="faq-item__answer-wrapper"
						class:is-open={isOpen}
					>
						<div class="faq-item__answer">
							{getAnswer(faq)}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Contact CTA -->
		<div class="faq__cta" class:is-visible={isVisible}>
			<p class="faq__cta-text">
				{language.current === 'es' ? 'No encontraste tu respuesta?' : "Didn't find your answer?"}
			</p>
			<a href="#contact" class="faq__cta-button">
				<span>{t(language.current, 'contact.title')}</span>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	.faq {
		position: relative;
		padding: 6rem 2rem;
	}

	.faq__container {
		max-width: 800px;
		margin: 0 auto;
	}

	/* Header */
	.faq__header {
		text-align: center;
		margin-bottom: 4rem;
		opacity: 0;
		transform: translateY(1rem);
		transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.faq__header.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.faq__eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--white-50);
		margin-bottom: 1rem;
	}

	.faq__title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 300;
		line-height: 1;
		color: var(--white-white);
		margin: 0 0 1rem;
	}

	.faq__subtitle {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--white-70);
		max-width: 500px;
		margin: 0 auto;
	}

	/* FAQ List */
	.faq__list {
		display: flex;
		flex-direction: column;
	}

	/* FAQ Item */
	.faq-item {
		border-bottom: 1px solid var(--white-10);
		opacity: 0;
		transform: translateY(1rem);
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay, 0s);
	}

	.faq-item.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.faq-item:first-child {
		border-top: 1px solid var(--white-10);
	}

	/* Question button */
	.faq-item__question {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1.5rem 0;
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.faq-item__question:hover {
		color: var(--accent-purple, #8b5cf6);
	}

	.faq-item__question-text {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--white-white);
		transition: color 0.3s ease;
	}

	.faq-item__question:hover .faq-item__question-text {
		color: var(--accent-purple, #8b5cf6);
	}

	.faq-item__icon {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--white-10);
		color: var(--white-50);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.faq-item__question:hover .faq-item__icon {
		border-color: var(--accent-purple, #8b5cf6);
		color: var(--accent-purple, #8b5cf6);
	}

	.faq-item__icon.is-open {
		background: var(--accent-purple, #8b5cf6);
		border-color: var(--accent-purple, #8b5cf6);
		color: var(--navy-deepest, #001239);
	}

	.faq-item__icon-vertical {
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.faq-item__icon.is-open .faq-item__icon-vertical {
		transform: rotate(90deg);
		opacity: 0;
	}

	/* Answer */
	.faq-item__answer-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.faq-item__answer-wrapper.is-open {
		grid-template-rows: 1fr;
	}

	.faq-item__answer {
		overflow: hidden;
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--white-70);
	}

	.faq-item__answer-wrapper.is-open .faq-item__answer {
		padding-bottom: 1.5rem;
	}

	/* CTA */
	.faq__cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 4rem;
		border-top: 1px solid var(--white-10);
		opacity: 0;
		transform: translateY(1rem);
		transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: 0.6s;
	}

	.faq__cta.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.faq__cta-text {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.9375rem;
		color: var(--white-50);
		margin: 0;
	}

	.faq__cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.75rem;
		background: transparent;
		border: 1px solid var(--white-30);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--white-white);
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.faq__cta-button:hover {
		background: var(--white-white);
		border-color: var(--white-white);
		color: var(--navy-deepest, #001239);
	}

	.faq__cta-button svg {
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.faq__cta-button:hover svg {
		transform: translateX(4px);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.faq__header,
		.faq-item,
		.faq__cta,
		.faq-item__answer-wrapper,
		.faq-item__icon,
		.faq-item__icon-vertical {
			transition: none;
		}
	}
</style>
