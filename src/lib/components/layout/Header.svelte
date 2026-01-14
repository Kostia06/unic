<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { currency } from '$stores/currency.svelte';
	import { cart } from '$stores/cart.svelte';
	import { t } from '$utils/i18n';

	let isScrolled = $state(false);
	let hidden = $state(false);
	let isMobileMenuOpen = $state(false);
	let lastScrollY = $state(0);

	const navLinks = [
		{ href: '#productos', key: 'nav.products', isPage: false },
		{ href: '/nosotros', key: 'nav.about', isPage: true },
		{ href: '#contacto', key: 'nav.contact', isPage: false }
	];

	function handleScroll() {
		const currentScrollY = window.scrollY;
		isScrolled = currentScrollY > 50;

		if (currentScrollY > 100) {
			hidden = currentScrollY > lastScrollY;
		} else {
			hidden = false;
		}

		lastScrollY = currentScrollY;
	}

	function scrollTo(href: string) {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		isMobileMenuOpen = false;
	}

	function toggleLanguage() {
		language.toggle();
	}

	function toggleCurrency() {
		currency.toggle();
	}

	function toggleCart() {
		cart.toggle();
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});

	$effect(() => {
		if (typeof window !== 'undefined' && isMobileMenuOpen) {
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					isMobileMenuOpen = false;
				}
			};
			window.addEventListener('keydown', handleEscape);
			return () => window.removeEventListener('keydown', handleEscape);
		}
	});

	$effect(() => {
		if (typeof document !== 'undefined') {
			if (isMobileMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});
</script>

<header
	class="header"
	class:header-scrolled={isScrolled}
	class:header-hidden={hidden}
>
	<div class="header-container">
		<nav class="header-nav">
			<!-- Logo -->
			<a href="/" class="logo" aria-label="Fam Unic - Home">
				<span class="logo-diamond"></span>
				<span class="logo-text">fam unic</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="nav-links">
				{#each navLinks as link (link.href)}
					{#if link.isPage}
						<a href={link.href} class="nav-link">
							<span class="nav-link-text">{t(language.current, link.key)}</span>
						</a>
					{:else}
						<button
							type="button"
							onclick={() => scrollTo(link.href)}
							class="nav-link"
						>
							<span class="nav-link-text">{t(language.current, link.key)}</span>
						</button>
					{/if}
				{/each}
			</div>

			<!-- Right side controls -->
			<div class="header-controls">
				<button
					type="button"
					onclick={toggleLanguage}
					class="control-toggle"
					aria-label="Toggle language"
				>
					{language.current.toUpperCase()}
				</button>

				<button
					type="button"
					onclick={toggleCurrency}
					class="control-toggle control-toggle-hidden-mobile"
					aria-label="Toggle currency"
				>
					{currency.current}
				</button>

				<button
					type="button"
					onclick={toggleCart}
					class="cart-button"
					aria-label="Open cart"
				>
					<svg
						class="cart-icon"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					{#if cart.count > 0}
						<span class="cart-badge">{cart.count}</span>
					{/if}
				</button>

				<button
					type="button"
					onclick={toggleMobileMenu}
					class="mobile-menu-toggle"
					aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={isMobileMenuOpen}
				>
					<span class="hamburger" class:hamburger-open={isMobileMenuOpen}>
						<span class="hamburger-line"></span>
						<span class="hamburger-line"></span>
					</span>
				</button>
			</div>
		</nav>
	</div>
</header>

<!-- Mobile Menu Overlay -->
{#if isMobileMenuOpen}
	<div class="mobile-overlay" onclick={closeMobileMenu} role="presentation"></div>
{/if}

<!-- Mobile Menu -->
<div class="mobile-menu" class:mobile-menu-open={isMobileMenuOpen}>
	<nav class="mobile-nav">
		{#each navLinks as link, i (link.href)}
			{#if link.isPage}
				<a
					href={link.href}
					class="mobile-nav-link"
					style="animation-delay: {(i + 1) * 0.1}s"
					onclick={() => isMobileMenuOpen = false}
				>
					{t(language.current, link.key)}
				</a>
			{:else}
				<button
					type="button"
					onclick={() => scrollTo(link.href)}
					class="mobile-nav-link"
					style="animation-delay: {(i + 1) * 0.1}s"
				>
					{t(language.current, link.key)}
				</button>
			{/if}
		{/each}

		<div class="mobile-controls">
			<div class="mobile-control-group">
				<span class="mobile-control-label">Language</span>
				<button
					type="button"
					onclick={toggleLanguage}
					class="mobile-control-button"
				>
					{language.current.toUpperCase()}
				</button>
			</div>
			<div class="mobile-control-group">
				<span class="mobile-control-label">Currency</span>
				<button
					type="button"
					onclick={toggleCurrency}
					class="mobile-control-button"
				>
					{currency.current}
				</button>
			</div>
		</div>
	</nav>
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════
	   HEADER - Art Deco Style with Navy/Purple Theme
	   ═══════════════════════════════════════════════════════════════════ */

	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: transparent;
		transition: all 0.4s ease;
	}

	.header-scrolled {
		background: rgba(0, 18, 57, 0.92);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--purple-10, rgba(139, 92, 246, 0.1));
	}

	.header-hidden {
		transform: translateY(-100%);
	}

	.header-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.header-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 4.5rem;
	}

	@media (min-width: 768px) {
		.header-nav {
			height: 5rem;
		}
	}

	/* ─── Logo ─── */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.logo-diamond {
		width: 8px;
		height: 8px;
		background: var(--purple, #8b5cf6);
		transform: rotate(45deg);
		transition: transform 0.5s ease, background 0.3s ease;
	}

	.logo:hover .logo-diamond {
		transform: rotate(225deg);
		background: var(--white, #ffffff);
	}

	.logo-text {
		font-family: var(--font-elegant, 'Cormorant Garamond', serif);
		font-size: 1.375rem;
		font-weight: 400;
		font-style: italic;
		color: var(--white, #ffffff);
		letter-spacing: 0.02em;
		transition: color 0.3s ease;
	}

	@media (min-width: 768px) {
		.logo-text {
			font-size: 1.5rem;
		}
	}

	.logo:hover .logo-text {
		color: var(--purple-light, #a78bfa);
	}

	/* ─── Navigation Links ─── */
	.nav-links {
		display: none;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		gap: 3rem;
	}

	@media (min-width: 768px) {
		.nav-links {
			display: flex;
		}
	}

	.nav-link {
		position: relative;
		background: none;
		border: none;
		padding: 0.5rem 0;
		cursor: pointer;
		font-family: var(--font-body, 'DM Sans', sans-serif);
		text-decoration: none;
		color: inherit;
	}

	.nav-link-text {
		font-size: 0.8125rem;
		font-weight: 300;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		transition: color 0.4s ease;
	}

	.nav-link:hover .nav-link-text {
		color: var(--purple-light, #a78bfa);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 4px;
		height: 4px;
		background: var(--purple, #8b5cf6);
		transform: translateX(-50%) rotate(45deg) scale(0);
		transition: transform 0.4s ease;
	}

	.nav-link:hover::after {
		transform: translateX(-50%) rotate(45deg) scale(1);
	}

	/* ─── Header Controls ─── */
	.header-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	@media (min-width: 768px) {
		.header-controls {
			gap: 1rem;
		}
	}

	.control-toggle {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.6875rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		padding: 0.375rem 0.75rem;
		background: none;
		border: 1px solid var(--white-20, rgba(255, 255, 255, 0.2));
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		cursor: pointer;
		transition: all 0.4s ease;
	}

	.control-toggle:hover {
		border-color: var(--purple, #8b5cf6);
		color: var(--purple-light, #a78bfa);
	}

	.control-toggle-hidden-mobile {
		display: none;
	}

	@media (min-width: 640px) {
		.control-toggle-hidden-mobile {
			display: block;
		}
	}

	/* ─── Cart Button ─── */
	.cart-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		transition: color 0.4s ease;
	}

	.cart-button:hover {
		color: var(--purple-light, #a78bfa);
	}

	.cart-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (min-width: 768px) {
		.cart-icon {
			width: 1.375rem;
			height: 1.375rem;
		}
	}

	.cart-badge {
		position: absolute;
		top: 0;
		right: 0;
		min-width: 1rem;
		height: 1rem;
		padding: 0 0.25rem;
		background: var(--purple, #8b5cf6);
		color: var(--white, #ffffff);
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.5625rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ─── Mobile Menu Toggle ─── */
	.mobile-menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
	}

	@media (min-width: 768px) {
		.mobile-menu-toggle {
			display: none;
		}
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 20px;
	}

	.hamburger-line {
		width: 100%;
		height: 1px;
		background: var(--white-70, rgba(255, 255, 255, 0.7));
		transition: all 0.4s ease;
		transform-origin: center;
	}

	.hamburger-open .hamburger-line:nth-child(1) {
		transform: translateY(3.5px) rotate(45deg);
	}

	.hamburger-open .hamburger-line:nth-child(2) {
		transform: translateY(-3.5px) rotate(-45deg);
	}

	/* ─── Mobile Overlay ─── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: rgba(0, 10, 30, 0.7);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	/* ─── Mobile Menu ─── */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		max-width: 320px;
		z-index: 45;
		background: var(--navy-deepest, #001239);
		border-left: 1px solid var(--purple-10, rgba(139, 92, 246, 0.1));
		transform: translateX(100%);
		transition: transform 0.4s ease;
	}

	.mobile-menu-open {
		transform: translateX(0);
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
		padding: 6rem 2rem 2rem;
		height: 100%;
	}

	.mobile-nav-link {
		font-family: var(--font-display, 'Bodoni Moda', serif);
		font-size: 1.75rem;
		font-weight: 400;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		padding: 1rem 0;
		background: none;
		border: none;
		border-bottom: 1px solid var(--purple-10, rgba(139, 92, 246, 0.1));
		text-align: left;
		cursor: pointer;
		transition: color 0.4s ease;
		opacity: 0;
		animation: slideIn 0.4s ease forwards;
		text-decoration: none;
		display: block;
	}

	.mobile-menu-open .mobile-nav-link {
		opacity: 1;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.mobile-nav-link:hover {
		color: var(--purple-light, #a78bfa);
	}

	.mobile-controls {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px solid var(--purple-10, rgba(139, 92, 246, 0.1));
	}

	.mobile-control-group {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.mobile-control-label {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.6875rem;
		font-weight: 400;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
	}

	.mobile-control-button {
		font-family: var(--font-body, 'DM Sans', sans-serif);
		font-size: 0.8125rem;
		font-weight: 400;
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid var(--purple-20, rgba(139, 92, 246, 0.2));
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		cursor: pointer;
		transition: all 0.4s ease;
	}

	.mobile-control-button:hover {
		border-color: var(--purple, #8b5cf6);
		color: var(--purple-light, #a78bfa);
	}
</style>
