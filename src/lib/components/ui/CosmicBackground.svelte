<script lang="ts">
	// CSS-only background - no Three.js needed for Crescent Sicily style
</script>

<div class="cosmic-background">
	<div class="gradient-layer"></div>
</div>

<style>
	.cosmic-background {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background: var(--navy-deepest, #001239);
	}

	.gradient-layer {
		width: 100%;
		height: 100%;
		background:
			radial-gradient(
				ellipse 80% 60% at 70% 30%,
				rgba(139, 92, 246, 0.05) 0%,
				transparent 50%
			),
			radial-gradient(
				ellipse 60% 80% at 20% 80%,
				rgba(236, 72, 153, 0.03) 0%,
				transparent 50%
			);
	}
</style>
