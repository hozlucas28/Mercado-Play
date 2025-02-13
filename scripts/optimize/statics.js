import { glob } from 'glob'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminWebp from 'imagemin-webp'
import fs from 'node:fs/promises'
import nodePath from 'node:path'
import { cwd } from 'node:process'
;(async () => {
	/** @type {string[]} */
	const optimizationFlag = '.optimized'

	/** @type {string[]} */
	const paths = await glob('./src/**/static?(s)/**/!(*.optimized).{jpg,png}')

	for (let i = 0; i < paths.length; i++) {
		/** @type {string} */
		const path = paths[i]

		/** @type {string} */
		const destination = nodePath.dirname(path)

		if (i) console.log('')
		console.log(`> Optimizing \"${nodePath.join(cwd(), path)}\"...\n`)

		/**@type {import('imagemin').Result[]} */
		const webpData = await imagemin([path], {
			glob: false,
			destination,
			plugins: [imageminWebp({ quality: 50, metadata: undefined })],
		})

		if (webpData.length) {
			/** @type {import('node:path').ParsedPath} */
			const parsedWEBPDestPath = nodePath.parse(webpData[0].destinationPath)

			/** @type {string} */
			const newWEBPDestPath = nodePath.join(
				parsedWEBPDestPath.dir,
				parsedWEBPDestPath.name + optimizationFlag + parsedWEBPDestPath.ext
			)

			await fs.rename(webpData[0].destinationPath, newWEBPDestPath)
			console.log(`> webp... \"${nodePath.join(cwd(), newWEBPDestPath)}\"`)
		} else {
			console.log(`> Error! An error occurred on convert \"${nodePath.join(cwd(), path)}\" to webp.`)
		}

		if (nodePath.extname(path) === '.png') {
			/**@type {import('imagemin').Result[]} */
			const pngData = await imagemin([path], {
				glob: false,
				destination,
				plugins: [imageminPngquant({ quality: [0.75, 0.75], strip: true })],
			})

			if (pngData.length) {
				/** @type {import('node:path').ParsedPath} */
				const parsedPNGDestPath = nodePath.parse(pngData[0].destinationPath)

				/** @type {string} */
				const newPNGDestPath = nodePath.join(
					parsedPNGDestPath.dir,
					parsedPNGDestPath.name + optimizationFlag + parsedPNGDestPath.ext
				)

				await fs.rename(pngData[0].destinationPath, newPNGDestPath)

				console.log(`> png... \"${nodePath.join(cwd(), newPNGDestPath)}\"`)
			} else {
				console.log(`> Error! An error occurred on optimize \"${nodePath.join(cwd(), path)}\" to png.`)
			}
		}

		await fs.rm(path)
	}
})()
