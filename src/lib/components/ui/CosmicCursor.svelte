<script lang="ts">
	import { onMount } from 'svelte';

	// Cursor state
	let cursorX = $state(0);
	let cursorY = $state(0);
	let cursorVisible = $state(false);
	let isHovering = $state(false);
	let isClicking = $state(false);

	// Particle system
	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
		color: string;
	}

	let particles: Particle[] = [];
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let reducedMotion = false;
	let animationId: number;

	// Particle colors (purple/pink/cyan spectrum)
	const particleColors = [
		'rgba(168, 85, 247, 0.8)',  // Purple glow
		'rgba(236, 72, 153, 0.8)',  // Pink glow
		'rgba(34, 211, 238, 0.7)',  // Cyan glow
		'rgba(255, 255, 255, 0.9)', // White
		'rgba(254, 243, 199, 0.8)'  // Warm star
	];

	function createParticle(x: number, y: number) {
		const angle = Math.random() * Math.PI * 2;
		const speed = Math.random() * 1.5 + 0.5;
		return {
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: 1,
			maxLife: Math.random() * 30 + 20,
			size: Math.random() * 3 + 1,
			color: particleColors[Math.floor(Math.random() * particleColors.length)]
		};
	}

	function updateParticles() {
		particles = particles.filter(p => {
			p.x += p.vx;
			p.y += p.vy;
			p.vx *= 0.98;
			p.vy *= 0.98;
			p.life -= 1 / p.maxLife;
			return p.life > 0;
		});
	}

	function drawParticles() {
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach(p => {
			ctx!.save();
			ctx!.globalAlpha = p.life;
			ctx!.fillStyle = p.color;
			ctx!.beginPath();
			ctx!.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
			ctx!.fill();

			// Add glow effect
			ctx!.shadowBlur = 10;
			ctx!.shadowColor = p.color;
			ctx!.fill();
			ctx!.restore();
		});
	}

	function animate() {
		updateParticles();
		drawParticles();
		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!reducedMotion && canvas) {
			ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			animate();
		}

		let lastX = 0;
		let lastY = 0;
		let particleTimer = 0;

		const handleMouseMove = (e: MouseEvent) => {
			cursorX = e.clientX;
			cursorY = e.clientY;
			cursorVisible = true;

			// Create particles on movement
			if (!reducedMotion) {
				const distance = Math.sqrt(
					Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
				);

				particleTimer++;
				if (distance > 5 && particleTimer % 2 === 0) {
					particles.push(createParticle(e.clientX, e.clientY));
					// Limit particles
					if (particles.length > 50) {
						particles.shift();
					}
				}

				lastX = e.clientX;
				lastY = e.clientY;
			}
		};

		const handleMouseDown = () => {
			isClicking = true;
			// Burst of particles on click
			if (!reducedMotion) {
				for (let i = 0; i < 8; i++) {
					particles.push(createParticle(cursorX, cursorY));
				}
			}
		};

		const handleMouseUp = () => {
			isClicking = false;
		};

		const handleMouseEnter = () => {
			cursorVisible = true;
		};

		const handleMouseLeave = () => {
			cursorVisible = false;
		};

		const handleResize = () => {
			if (canvas) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}
		};

		// Detect hoverable elements
		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			isHovering = !!(
				target.closest('a') ||
				target.closest('button') ||
				target.closest('[role="button"]') ||
				target.closest('input') ||
				target.closest('textarea') ||
				target.closest('select') ||
				target.closest('[data-cursor-hover]')
			);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('mouseenter', handleMouseEnter);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseover', handleMouseOver);
		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('mouseenter', handleMouseEnter);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseover', handleMouseOver);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<!-- Only render on desktop -->
<div class="cosmic-cursor-container hidden lg:block">
	<!-- Particle trail canvas -->
	<canvas
		bind:this={canvas}
		class="particle-canvas"
		aria-hidden="true"
	></canvas>

	<!-- Main cursor -->
	<div
		class="cursor-main"
		class:visible={cursorVisible}
		class:hovering={isHovering}
		class:clicking={isClicking}
		style="transform: translate({cursorX}px, {cursorY}px)"
		aria-hidden="true"
	>
		<div class="cursor-dot"></div>
		<div class="cursor-ring"></div>
	</div>
</div>

<style>
	.cosmic-cursor-container {
		pointer-events: none;
		position: fixed;
		inset: 0;
		z-index: 9999;
		overflow: hidden;
	}

	.particle-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.cursor-main {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
		will-change: transform;
	}

	.cursor-main.visible {
		opacity: 1;
	}

	.cursor-dot {
		position: absolute;
		width: 6px;
		height: 6px;
		background: white;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow:
			0 0 10px rgba(168, 85, 247, 0.8),
			0 0 20px rgba(168, 85, 247, 0.5),
			0 0 30px rgba(168, 85, 247, 0.3);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.cursor-ring {
		position: absolute;
		width: 32px;
		height: 32px;
		border: 1px solid rgba(168, 85, 247, 0.5);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition: transform 0.2s ease, border-color 0.2s ease, width 0.2s ease, height 0.2s ease;
	}

	/* Hover state */
	.cursor-main.hovering .cursor-dot {
		transform: translate(-50%, -50%) scale(1.5);
		box-shadow:
			0 0 15px rgba(236, 72, 153, 0.8),
			0 0 30px rgba(236, 72, 153, 0.5),
			0 0 45px rgba(236, 72, 153, 0.3);
	}

	.cursor-main.hovering .cursor-ring {
		width: 48px;
		height: 48px;
		border-color: rgba(236, 72, 153, 0.6);
	}

	/* Click state */
	.cursor-main.clicking .cursor-dot {
		transform: translate(-50%, -50%) scale(0.8);
	}

	.cursor-main.clicking .cursor-ring {
		transform: translate(-50%, -50%) scale(0.9);
		border-color: rgba(34, 211, 238, 0.8);
	}
</style>
