<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { currency } from '$stores/currency.svelte';
	import { cart } from '$stores/cart.svelte';
	import { t } from '$utils/i18n';

	// State with Svelte 5 runes
	let isScrolled = $state(false);
	let hidden = $state(false);
	let isMobileMenuOpen = $state(false);
	let lastScrollY = $state(0);

	// Navigation links per specification
	const navLinks = [
		{ href: '#productos', key: 'nav.products', isPage: false },
		{ href: '/nosotros', key: 'nav.about', isPage: true },
		{ href: '#contacto', key: 'nav.contact', isPage: false }
	];

	function handleScroll() {
		const currentScrollY = window.scrollY;

		// Determine if scrolled past threshold for glass effect
		isScrolled = currentScrollY > 50;

		// Hide on scroll down, show on scroll up (only after 100px)
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

	// Close mobile menu on escape key
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

	// Prevent body scroll when mobile menu is open
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
				<div class="logo-icon">
					<svg
						viewBox="0 0 40 40"
						class="logo-spiral"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							d="M20 4 C 30 4, 36 10, 36 20 C 36 28, 30 34, 22 34 C 14 34, 10 28, 10 22 C 10 16, 14 12, 20 12 C 24 12, 28 16, 28 20 C 28 24, 24 26, 20 26 C 18 26, 16 24, 16 20"
						/>
					</svg>
				</div>
				<span class="logo-text font-script">fam unic</span>
			</a>

			<!-- Desktop Navigation - Centered -->
			<div class="nav-links">
				{#each navLinks as link (link.href)}
					{#if link.isPage}
						<a href={link.href} class="nav-link">
							<span class="nav-link-text">{t(language.current, link.key)}</span>
							<span class="nav-link-underline"></span>
						</a>
					{:else}
						<button
							type="button"
							onclick={() => scrollTo(link.href)}
							class="nav-link"
						>
							<span class="nav-link-text">{t(language.current, link.key)}</span>
							<span class="nav-link-underline"></span>
						</button>
					{/if}
				{/each}
			</div>

			<!-- Right side controls -->
			<div class="header-controls">
				<!-- Language toggle -->
				<button
					type="button"
					onclick={toggleLanguage}
					class="control-toggle"
					aria-label="Toggle language"
				>
					{language.current.toUpperCase()}
				</button>

				<!-- Currency toggle -->
				<button
					type="button"
					onclick={toggleCurrency}
					class="control-toggle control-toggle-hidden-mobile"
					aria-label="Toggle currency"
				>
					{currency.current}
				</button>

				<!-- Cart button -->
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
							stroke-width="1.5"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					{#if cart.count > 0}
						<span class="cart-badge">{cart.count}</span>
					{/if}
				</button>

				<!-- Mobile menu button -->
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
	/* Header Base */
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
		background: rgba(0, 18, 57, 0.9);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
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

	/* Logo */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.logo-icon {
		width: 2rem;
		height: 2rem;
		position: relative;
	}

	@media (min-width: 768px) {
		.logo-icon {
			width: 2.5rem;
			height: 2.5rem;
		}
	}

	.logo-spiral {
		width: 100%;
		height: 100%;
		color: var(--accent-purple, #8b5cf6);
		transition: transform 0.7s ease, color 0.4s ease;
	}

	.logo:hover .logo-spiral {
		transform: rotate(180deg);
		color: var(--white-white);
	}

	.logo-text {
		font-size: 1.25rem;
		color: var(--white-white);
		transition: text-shadow 0.4s ease;
	}

	@media (min-width: 768px) {
		.logo-text {
			font-size: 1.5rem;
		}
	}

	.logo:hover .logo-text {
		text-shadow: var(--glow-purple);
	}

	/* Navigation Links - Centered */
	.nav-links {
		display: none;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		gap: 2.5rem;
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
		font-family: inherit;
		text-decoration: none;
		color: inherit;
	}

	.nav-link-text {
		font-size: 0.875rem;
		letter-spacing: 0.02em;
		color: var(--white-70);
		transition: color 0.4s ease;
	}

	.nav-link:hover .nav-link-text {
		color: var(--white-white);
	}

	.nav-link-underline {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background: var(--accent-purple, #8b5cf6);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.nav-link:hover .nav-link-underline {
		transform: scaleX(1);
	}

	/* Header Controls */
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
		font-size: 0.75rem;
		font-weight: 500;
		font-family: inherit;
		letter-spacing: 0.05em;
		padding: 0.375rem 0.75rem;
		background: none;
		border: 1px solid var(--white-30);
		border-radius: 9999px;
		color: var(--white-70);
		cursor: pointer;
		transition: all 0.4s ease;
	}

	.control-toggle:hover {
		border-color: var(--accent-purple, #8b5cf6);
		color: var(--white-white);
	}

	.control-toggle-hidden-mobile {
		display: none;
	}

	@media (min-width: 640px) {
		.control-toggle-hidden-mobile {
			display: block;
		}
	}

	/* Cart Button */
	.cart-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--white-70);
		transition: color 0.4s ease;
	}

	.cart-button:hover {
		color: var(--white-white);
	}

	.cart-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (min-width: 768px) {
		.cart-icon {
			width: 1.5rem;
			height: 1.5rem;
		}
	}

	.cart-badge {
		position: absolute;
		top: 0;
		right: 0;
		min-width: 1.125rem;
		height: 1.125rem;
		padding: 0 0.25rem;
		background: var(--accent-purple, #8b5cf6);
		color: var(--white-white);
		font-size: 0.625rem;
		font-weight: 600;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Mobile Menu Toggle */
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
		gap: 5px;
		width: 20px;
	}

	.hamburger-line {
		width: 100%;
		height: 1.5px;
		background: var(--white-70);
		transition: all 0.4s ease;
		transform-origin: center;
	}

	.hamburger-open .hamburger-line:nth-child(1) {
		transform: translateY(6.5px) rotate(45deg);
	}

	.hamburger-open .hamburger-line:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
	}

	.hamburger-open .hamburger-line:nth-child(3) {
		transform: translateY(-6.5px) rotate(-45deg);
	}

	/* Mobile Overlay */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	/* Mobile Menu */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		max-width: 320px;
		z-index: 45;
		background: rgba(0, 18, 57, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-left: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
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
		font-size: 1.5rem;
		font-weight: 300;
		font-family: 'Playfair Display', Georgia, serif;
		color: var(--white-70);
		padding: 1rem 0;
		background: none;
		border: none;
		border-bottom: 1px solid var(--white-10);
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
		color: var(--white-white);
	}

	.mobile-controls {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px solid var(--white-10);
	}

	.mobile-control-group {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.mobile-control-label {
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--white-50);
	}

	.mobile-control-button {
		font-size: 0.875rem;
		font-weight: 500;
		font-family: inherit;
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid var(--white-30);
		border-radius: 9999px;
		color: var(--white-70);
		cursor: pointer;
		transition: all 0.4s ease;
	}

	.mobile-control-button:hover {
		border-color: var(--accent-purple, #8b5cf6);
		color: var(--white-white);
	}
</style>
