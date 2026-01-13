<script lang="ts">
	/**
	 * MarqueeBanner - Infinite scrolling announcement banner
	 * Inspired by Crescent Sicily's "SPEDIZIONE GRATUITA" banner
	 */

	interface Props {
		text: string;
		speed?: number; // Duration in seconds
		direction?: 'left' | 'right';
		separator?: string;
	}

	let { text, speed = 30, direction = 'left', separator = '★' }: Props = $props();

	// Create repeated text for seamless loop (reactive to text changes)
	let repeatedItems = $derived(Array(8).fill(text));
</script>

<div class="marquee-banner" style="--speed: {speed}s; --direction: {direction === 'left' ? 'normal' : 'reverse'}">
	<div class="marquee-track">
		{#each repeatedItems as item, i}
			<span class="marquee-item">{item}</span>
			<span class="marquee-separator">{separator}</span>
		{/each}
		{#each repeatedItems as item, i}
			<span class="marquee-item">{item}</span>
			<span class="marquee-separator">{separator}</span>
		{/each}
	</div>
</div>

<style>
	.marquee-banner {
		width: 100%;
		overflow: hidden;
		background: var(--navy-deep, #001a4d);
		border-top: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
		border-bottom: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
		padding: 0.75rem 0;
	}

	.marquee-track {
		display: flex;
		gap: 2rem;
		width: max-content;
		animation: marquee var(--speed) linear infinite;
		animation-direction: var(--direction);
	}

	.marquee-banner:hover .marquee-track {
		animation-play-state: paused;
	}

	.marquee-item {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		white-space: nowrap;
	}

	.marquee-separator {
		color: var(--accent-purple, #8b5cf6);
		font-size: 0.625rem;
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
	}
</style>
