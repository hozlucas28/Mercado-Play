import type { AppleDeviceSize, AssetType, ResolvedAssetSize } from '@vite-pwa/assets-generator/config'

import {
	AllAppleDeviceNames,
	createAppleSplashScreens,
	defineConfig,
	minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

import { BRAND, COMPRESS_CONFIGURATION } from './src/constants'

/* ------------------------- Configuration Variables ------------------------ */

const { png: pngQuality } = COMPRESS_CONFIGURATION.images.outputFormats

/* -------------------------------- Utilities ------------------------------- */

// General
function assetName(type: AssetType, size: ResolvedAssetSize): string {
	switch (type) {
		case 'apple':
			return `apple-touch-icon-${size.width}x${size.height}.png`

		default:
			return `manifest-icon-${size.width}x${size.height}.${type}.png`
	}
}

// Apple
function appleAssetName(landscape: boolean, size: AppleDeviceSize, dark?: boolean): string {
	return `apple-splash-${landscape ? 'landscape' : 'portrait'}-${size.width}x${size.height}.png`
}

const appleSplashScreens = createAppleSplashScreens(
	{
		name: appleAssetName,
		padding: 0,

		png: {
			quality: pngQuality,
			compressionLevel: 6,
		},

		resizeOptions: {
			background: BRAND.primaryColor,
		},

		linkMediaOptions: {
			basePath: '/',
			log: true,
			xhtml: true,
			addMediaScreen: true,
		},
	},

	AllAppleDeviceNames
)

/* ---------------------------------- Main ---------------------------------- */

export default defineConfig({
	images: ['public/icons/_favicon.svg'],

	logLevel: 'info',

	overrideAssets: true,
	manifestIconsEntry: true,

	headLinkOptions: {
		preset: '2023',
		basePath: '/',
		xhtml: true,
		includeId: false,
	},

	preset: {
		...minimal2023Preset,

		assetName,

		png: {
			quality: pngQuality,
			compressionLevel: 6,
		},

		apple: {
			...minimal2023Preset.apple,

			padding: 0,
			sizes: [180, 167, 152, 120, 76, 57],

			resizeOptions: {
				background: BRAND.primaryColor,
			},
		},

		appleSplashScreens,

		maskable: {
			...minimal2023Preset.maskable,

			padding: 0.2,
			sizes: [512, 192, 64],

			resizeOptions: {
				background: BRAND.primaryColor,
			},
		},

		transparent: {
			...minimal2023Preset.transparent,

			padding: 0.2,
			sizes: [512, 192, 64],

			resizeOptions: {
				background: BRAND.primaryColor,
			},
		},
	},
})
