<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { t } from '$utils/i18n';

	// State for logo hover animation
	let isLogoHovered = $state(false);

	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{ href: '#products', key: 'footer.links.products' },
		{ href: '#nosotros', key: 'footer.links.about' },
		{ href: '#faq', key: 'footer.links.faq' },
		{ href: '#contacto', key: 'footer.links.contact' }
	];

	function scrollTo(href: string) {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-grid">
			<!-- Brand column -->
			<div class="footer-brand">
				<button
					onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					onmouseenter={() => (isLogoHovered = true)}
					onmouseleave={() => (isLogoHovered = false)}
					class="logo-button"
				>
					<div class="logo-icon">
						<svg
							viewBox="0 0 40 40"
							class="logo-spiral"
							class:rotate={isLogoHovered}
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
				</button>

				<p class="footer-tagline">
					{t(language.current, 'footer.tagline')}
				</p>

				<!-- Social links -->
				<div class="social-links">
					<a
						href="https://instagram.com/famunic"
						target="_blank"
						rel="noopener noreferrer"
						class="social-link"
						aria-label="Instagram"
					>
						<svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Links column -->
			<div class="footer-links">
				<h4 class="footer-heading">Links</h4>
				<nav class="footer-nav">
					{#each footerLinks as link}
						<button
							onclick={() => scrollTo(link.href)}
							class="footer-link"
						>
							{t(language.current, link.key)}
						</button>
					{/each}
				</nav>
			</div>

			<!-- Contact column -->
			<div class="footer-contact">
				<h4 class="footer-heading">{t(language.current, 'contact.title')}</h4>
				<div class="contact-info">
					<a href="mailto:hola@famunic.com" class="contact-link">
						hola@famunic.com
					</a>
					<span class="contact-location">Mexico</span>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="footer-bottom">
			<p class="copyright">
				&copy; {currentYear} Fam Unic. {t(language.current, 'footer.copyright').replace('© 2024 Fam Unic. ', '')}
			</p>
			<p class="made-in">
				Hecho con
				<span class="star">✦</span>
				en Mexico
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		z-index: 10;
		border-top: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
		background: var(--navy-deep, #001a4d);
	}

	.footer-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr 1fr;
			gap: 3rem;
		}
	}

	/* Brand */
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.logo-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		width: fit-content;
	}

	.logo-icon {
		width: 2.5rem;
		height: 2.5rem;
	}

	.logo-spiral {
		width: 100%;
		height: 100%;
		color: var(--accent-purple, #8b5cf6);
		transition: transform 1s ease, color 0.3s ease;
	}

	.logo-spiral.rotate {
		transform: rotate(360deg);
	}

	.logo-button:hover .logo-spiral {
		color: var(--accent-pink, #ec4899);
	}

	.logo-text {
		font-size: 1.25rem;
		color: var(--white, #ffffff);
	}

	.footer-tagline {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		max-width: 250px;
		margin: 0;
	}

	/* Social */
	.social-links {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.social-link {
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		transition: color 0.3s ease;
	}

	.social-link:hover {
		color: var(--accent-purple, #8b5cf6);
	}

	.social-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Links */
	.footer-heading {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		margin: 0 0 1rem;
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-link {
		background: none;
		border: none;
		padding: 0;
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		text-align: left;
		cursor: pointer;
		transition: color 0.3s ease;
	}

	.footer-link:hover {
		color: var(--accent-purple, #8b5cf6);
	}

	/* Contact */
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.contact-link {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.contact-link:hover {
		color: var(--accent-purple, #8b5cf6);
	}

	.contact-location {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
	}

	/* Bottom */
	.footer-bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
	}

	@media (min-width: 768px) {
		.footer-bottom {
			flex-direction: row;
		}
	}

	.copyright {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		margin: 0;
	}

	.made-in {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		margin: 0;
	}

	.star {
		color: var(--accent-purple, #8b5cf6);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}
</style>
