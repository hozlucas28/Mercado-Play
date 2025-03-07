import { glob } from 'glob'
import { imageSizeFromFile } from 'image-size/fromFile'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import fs from 'node:fs/promises'
import nodePath from 'node:path'
import { cwd } from 'node:process'
import { format, styleText } from 'node:util'

/* ------------------------- Configuration Variables ------------------------ */

/** @type {string} */
const rawFileFlag = '__'

/** @type {string} */
const sep = '-'

/** @type {['jpg', 'png']} */
const imgExts = ['jpg', 'png']

/** @type {['mp4']} */
const videoExts = ['mp4']

/** @type {['2xl', 'xl', 'lg', 'md', 'sm']} */
const breakpoints = ['2xl', 'xl', 'lg', 'md', 'sm']

/* -------------------------------- Utilities ------------------------------- */

async function rmCompressedFiles() {
	/** @type {string[]} */
	const rawFilePaths = await glob(`./src/**/static?(s)/**/${rawFileFlag}*.+(${[...imgExts, ...videoExts].join('|')})`)

	for (const rawFilePath of rawFilePaths) {
		/** @type {string} */
		const newRawFilePath = nodePath.join(
			nodePath.dirname(rawFilePath),
			nodePath.basename(rawFilePath).replace(rawFileFlag, '')
		)

		await fs.rename(rawFilePath, newRawFilePath)
	}

	// Remove compressed images

	/** @type {string[]} */
	const compressedImgPaths = await glob(
		`./src/**/static?(s)/**/*@(${sep})+(${breakpoints.join('|')}).+(${imgExts.join('|')})`
	)

	for (const compressedImgPath of compressedImgPaths) await fs.rm(compressedImgPath)

	// Remove compressed videos

	/** @type {string[]} */
	const presetPaths = await glob(`./scripts/compress/handbrake-presets/[^${sep}]*${sep}*.json`)
	const presetCategories = presetPaths.map((preset) => preset.split(sep)[0])

	/** @type {string[]} */
	const compressedVideoPaths = await glob(
		`./src/**/static?(s)/**/*@(${sep})+(${presetCategories.join('|')}).+(${videoExts.join('|')})`
	)

	for (const compressedVideoPath of compressedVideoPaths) await fs.rm(compressedVideoPath)
}

/** @type {Record<imgExts[number] | 'undefined', (filePath: string) => Promise<void>>} */
const imgCompressionActions = {
	jpg: async (imgPath) => {
		/**@type {Awaited<ReturnType<typeof import('image-size/fromFile').imageSizeFromFile>>} */
		const { width, height } = await imageSizeFromFile(imgPath)

		/**@type {Record<breakpoints[number], {width: number, height: number, bytesThreshold: number}>} */
		const sizePerBreakpoint = {
			'2xl': {
				width: width - (width - 1536),
				height: Math.round((height / width) * (width - (width - 1536))),
				bytesThreshold: 125 * 1024,
			},

			'xl': {
				width: width - (width - 1280),
				height: Math.round((height / width) * (width - (width - 1280))),
				bytesThreshold: 100 * 1024,
			},

			'lg': {
				width: width - (width - 1024),
				height: Math.round((height / width) * (width - (width - 1024))),
				bytesThreshold: 75 * 1024,
			},

			'md': {
				width: width - (width - 768),
				height: Math.round((height / width) * (width - (width - 768))),
				bytesThreshold: 50 * 1024,
			},

			'sm': {
				width: width - (width - 640),
				height: Math.round((height / width) * (width - (width - 640))),
				bytesThreshold: 25 * 1024,
			},
		}

		/** @type {import('node:path').ParsedPath} */
		const parsedImgPath = nodePath.parse(imgPath)

		for (const breakpoint in sizePerBreakpoint) {
			/**@type {import('imagemin-webp').Resize} */
			const size = sizePerBreakpoint[breakpoint]

			/**@type {import('imagemin').Result[]} */
			const webps = await imagemin([imgPath], {
				glob: false,
				destination: parsedImgPath.dir,
				plugins: [
					imageminWebp({
						quality: 100,
						size: size.bytesThreshold,
						resize: { width: size.width, height: size.height },
					}),
				],
			})

			if (!webps.length) {
				console.error(
					styleText(
						'red',
						format(
							'> Error! An error occurred on convert "%s" (%dx%d) to webp.',
							nodePath.join(cwd(), imgPath),
							size.width,
							size.height
						)
					)
				)
			}

			/** @type {string} */
			const newDest = nodePath.join(parsedImgPath.dir, parsedImgPath.name + sep + breakpoint + '.webp')

			await fs.rename(webps[0].destinationPath, newDest)

			console.log(
				'> "%s" (%dx%d) [~%f kb]',
				nodePath.join(cwd(), newDest),
				size.width,
				size.height,
				(webps[0].data.byteLength / 1024).toExponential(3)
			)
		}

		/** @type {string} */
		const newImgPath = nodePath.join(nodePath.dirname(imgPath), rawFileFlag + nodePath.basename(imgPath))

		await fs.rename(imgPath, newImgPath)
	},

	png: async (imgPath) => await imgCompressionActions.jpg(imgPath),

	undefined: async (filePath) => {
		console.error(
			styleText('red', format('> Error! An error occurred on compress "%s".', nodePath.join(cwd(), filePath)))
		)
	},
}

/* ---------------------------------- Main ---------------------------------- */

;(async () => {
	/** @type {string | undefined} */
	if (process.argv.includes('--force')) await rmCompressedFiles()

	// Compress images

	/** @type {string[]} */
	const imgPaths = await glob(`./src/**/static?(s)/**/!(${rawFileFlag})*.+(${imgExts.join('|')})`)

	for (let i = 0; i < imgPaths.length; i++) {
		/** @type {string} */
		const imgPath = imgPaths[i]

		/** @type {fs.FileHandle} */
		const img = await fs.open(imgPath)

		/** @type {number} */
		const imgSize = (await img.stat()).size / 1024

		img.close()

		if (i) console.log()
		console.log('> Optimizing "%s" [~%f kb]...\n', nodePath.join(cwd(), imgPath), imgSize.toExponential(3))

		/** @type {imgExts[number]} */
		const imgExt = nodePath.extname(imgPath).slice(1)

		await imgCompressionActions[imgExt](imgPath)
	}

	if (!imgPaths.length) console.log('> There is no new images to compress.\n')

	// Compress videos

	/** @type {string[]} */
	const videoPaths = await glob(`./src/**/static?(s)/**/!(${rawFileFlag})*.+(${videoExts.join('|')})`)

	/** @type {string[]} */
	const presetPaths = await glob(`./scripts/compress/handbrake-presets/[^${sep}]*${sep}*.json`)

	if (imgPaths.length) console.log()

	if (videoPaths.length && !presetPaths.length) {
		console.error(styleText('red', '> Missing handbrake preset/s for:\n'))

		for (const videoPath of videoPaths) {
			console.error(styleText('red', format('> "%s"', nodePath.join(cwd(), videoPath))))
		}

		return
	}

	for (let i = 0; i < videoPaths.length; i++) {
		/** @type {string} */
		const videoPath = videoPaths[i]

		/** @type {import('node:path').ParsedPath} */
		const parsedVideoPath = nodePath.parse(videoPath)

		/** @type {string} */
		const newVideoPath = nodePath.join(parsedVideoPath.dir, `${rawFileFlag}${parsedVideoPath.base}`)

		await fs.rename(videoPath, newVideoPath)

		if (i) console.log()
		console.log('> Manually compress "%s"...\n', nodePath.join(cwd(), newVideoPath))

		for (let j = 0; j < presetPaths.length; j++) {
			/** @type {string} */
			const presetPath = presetPaths[j]

			/** @type {string} */
			const presetCategory = nodePath.basename(presetPath).split(sep)[0]

			console.info(
				styleText(
					'yellow',
					format(
						'> The video compressed with "%s" preset must be named "%s".',
						presetCategory,
						parsedVideoPath.name + sep + presetCategory + '.mp4'
					)
				)
			)
		}

		console.info(
			styleText(
				'blue',
				format('\n> Handbrake presets are inside "%s".', nodePath.join(cwd(), nodePath.dirname(presetPaths[0])))
			)
		)
	}

	if (!videoPaths.length) console.log('> There is no new videos to compress.')
})()
