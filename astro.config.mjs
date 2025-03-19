// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import pwa from '@vite-pwa/astro'
import { BRAND } from './src/constants.ts'

/** @type {string} */
const pwaID = `${BRAND.name.toLowerCase().replaceAll(' ', '-')}-pwa`

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		tailwind(),
		pwa({
			outDir: 'dist',
			srcDir: 'public',
			manifestFilename: 'manifest.webmanifest',
			mode: /** @type {'development' | 'production'} */ (import.meta.env.MODE),
			base: '/',
			scope: '/',
			registerType: 'autoUpdate',
			minify: true,

			pwaAssets: {
				config: true,
				injectThemeColor: true,
				includeHtmlHeadLinks: true,
				overrideManifestIcons: true,
			},

			manifest: {
				id: pwaID,
				name: BRAND.name,
				short_name: BRAND.name,
				description: BRAND.description,
				theme_color: '#0e0e11',
				background_color: BRAND.primaryColor,
				dir: 'ltr',
				lang: 'es',
				display: 'standalone',
				display_override: ['minimal-ui', 'browser'],
				scope: '/',
				start_url: './?utm_source=web_manifest',
				orientation: 'portrait',
				handle_links: 'preferred',

				screenshots: [
					{
						label: 'Home page',
						sizes: '1920x1080',
						form_factor: 'wide',
						src: '/screenshots/home__desktop.avif',
						type: 'image/avif',
					},
					{
						label: 'Film page',
						sizes: '1920x1080',
						form_factor: 'wide',
						src: '/screenshots/film__desktop.avif',
						type: 'image/avif',
					},
					{
						label: 'Serie page',
						sizes: '1920x1080',
						form_factor: 'wide',
						src: '/screenshots/serie__desktop.avif',
						type: 'image/avif',
					},
					{
						label: 'Home page',
						sizes: '360x640',
						form_factor: 'narrow',
						src: '/screenshots/home__mobile.avif',
						type: 'image/avif',
					},
					{
						label: 'Film page',
						sizes: '360x640',
						form_factor: 'narrow',
						src: '/screenshots/film__mobile.avif',
						type: 'image/avif',
					},
					{
						label: 'Serie page',
						sizes: '360x640',
						form_factor: 'narrow',
						src: '/screenshots/serie__mobile.avif',
						type: 'image/avif',
					},
				],
			},

			experimental: {
				directoryAndTrailingSlashHandler: true,
			},

			devOptions: {
				enabled: import.meta.env.DEV,
				navigateFallbackAllowlist: [/^\//],
			},
		}),
	],
})
