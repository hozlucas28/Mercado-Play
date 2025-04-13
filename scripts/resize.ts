import { RESIZE_CONFIGURATION } from '@/constants.ts'

import fsSync, { type Stats } from 'node:fs'
import fs from 'node:fs/promises'
import type { ParsedPath } from 'node:path'
import nodePath from 'node:path'
import { cwd } from 'node:process'
import { styleText } from 'node:util'
import type { OutputInfo } from 'sharp'
import sharp from 'sharp'

/* ------------------------- Configuration Variables ------------------------ */

const { extsToResize } = RESIZE_CONFIGURATION

/* ---------------------------------- Main ---------------------------------- */

async function main(): Promise<void> {
	if (process.argv.length !== 4) {
		console.error(styleText('red', '> Invalid number of arguments!\n'))
		console.error(styleText('blue', '> Usage: <directory> <width>'))
		process.exit(1)
	}

	const dir: string = process.argv[2]
	const width: number = parseInt(process.argv[3])

	let flag: boolean = false
	const images = fs.glob(`${dir}**/*.+(${extsToResize.join('|')})`)

	sharp.cache(false)

	for await (const path of images) {
		if (!flag) {
			flag = true
			console.log()
		}

		const parsedPath: ParsedPath = nodePath.parse(path)

		const outputPath: string = nodePath.join(parsedPath.dir, `${parsedPath.name}.temp${parsedPath.ext}`)
		if (fsSync.existsSync(outputPath)) await fs.rm(outputPath)

		const inputStats: Stats = await fs.stat(path)
		const outputStats: OutputInfo = await sharp(path).resize({ width, fit: 'contain' }).toFile(outputPath)

		await fs.rm(path)
		await fs.rename(outputPath, path)

		console.log(
			'> "%s" [~%f KB] resized to %dx%d [~%f KB]',
			nodePath.join(cwd(), path),
			(inputStats.size / 1024).toFixed(3),
			outputStats.width,
			outputStats.height,
			(outputStats.size / 1024).toFixed(2)
		)
	}

	sharp.cache(true)

	if (!flag) console.log('> There is no images to resize.')
}

;(async () => await main())()
