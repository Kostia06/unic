<script lang="ts">
	import { onMount } from 'svelte';

	// Props
	let { particleCount = 200, speed = 0.5, parallaxStrength = 0.02 } = $props();

	// State
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;
	let mouseX = 0;
	let mouseY = 0;
	let prefersReducedMotion = false;

	interface Star {
		x: number;
		y: number;
		size: number;
		opacity: number;
		twinkleSpeed: number;
		twinkleOffset: number;
		depth: number; // For parallax (0-1)
	}

	let stars: Star[] = [];
	let width = 0;
	let height = 0;

	function createStars() {
		// Reduce particle count on mobile
		const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
		const count = isMobile ? Math.floor(particleCount / 2) : particleCount;

		stars = Array.from({ length: count }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			size: Math.random() * 2 + 0.5,
			opacity: Math.random() * 0.8 + 0.2,
			twinkleSpeed: Math.random() * 0.02 + 0.01,
			twinkleOffset: Math.random() * Math.PI * 2,
			depth: Math.random()
		}));
	}

	function resize() {
		if (!canvas) return;

		const dpr = window.devicePixelRatio || 1;
		width = window.innerWidth;
		height = window.innerHeight;

		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		if (ctx) {
			ctx.scale(dpr, dpr);
		}

		createStars();
	}

	function handleMouseMove(e: MouseEvent) {
		// Center coordinates (0, 0) at screen center
		mouseX = (e.clientX - width / 2) / width;
		mouseY = (e.clientY - height / 2) / height;
	}

	function draw(time: number) {
		if (!ctx || prefersReducedMotion) return;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Draw stars
		for (const star of stars) {
			// Calculate parallax offset based on mouse position and star depth
			const parallaxX = mouseX * parallaxStrength * star.depth * width;
			const parallaxY = mouseY * parallaxStrength * star.depth * height;

			// Calculate position with parallax
			let x = star.x + parallaxX;
			let y = star.y + parallaxY;

			// Wrap around screen edges
			if (x < -10) x += width + 20;
			if (x > width + 10) x -= width + 20;
			if (y < -10) y += height + 20;
			if (y > height + 10) y -= height + 20;

			// Twinkle effect
			const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
			const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);

			// Draw star
			ctx.beginPath();
			ctx.arc(x, y, star.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(254, 243, 199, ${currentOpacity})`; // cosmic-star color
			ctx.fill();

			// Add glow for larger stars
			if (star.size > 1.5) {
				const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
				gradient.addColorStop(0, `rgba(254, 243, 199, ${currentOpacity * 0.5})`);
				gradient.addColorStop(1, 'rgba(254, 243, 199, 0)');
				ctx.beginPath();
				ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
				ctx.fillStyle = gradient;
				ctx.fill();
			}

			// Slowly drift stars
			star.y -= speed * (0.5 + star.depth * 0.5);
			if (star.y < -10) {
				star.y = height + 10;
				star.x = Math.random() * width;
			}
		}

		animationId = requestAnimationFrame(draw);
	}

	function drawStatic() {
		if (!ctx) return;

		ctx.clearRect(0, 0, width, height);

		for (const star of stars) {
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(254, 243, 199, ${star.opacity})`;
			ctx.fill();
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d');

		// Check for reduced motion preference
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mediaQuery.matches;

		mediaQuery.addEventListener('change', (e) => {
			prefersReducedMotion = e.matches;
			if (prefersReducedMotion) {
				cancelAnimationFrame(animationId);
				drawStatic();
			} else {
				animationId = requestAnimationFrame(draw);
			}
		});

		// Initial setup
		resize();

		// Start animation or draw static
		if (prefersReducedMotion) {
			drawStatic();
		} else {
			animationId = requestAnimationFrame(draw);
		}

		// Event listeners
		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 pointer-events-none z-0"
	aria-hidden="true"
></canvas>
