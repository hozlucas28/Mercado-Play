import { BREAKPOINTS, COMPRESS_CONFIGURATION } from '@/constants'
import type { Breakpoint, CompressConfiguration } from '@/types'
import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import type { ParsedPath } from 'node:path'
import nodePath from 'node:path'
import { cwd } from 'node:process'
import { format, styleText } from 'node:util'
import type { Metadata, OutputInfo } from 'sharp'
import sharp from 'sharp'

/* ---------------------------------- Types --------------------------------- */

interface Size {
	width: number
	height: number
}

type OutputFormat = keyof CompressConfiguration['images']['outputFormats']

/* ------------------------- Configuration Variables ------------------------ */

const { rawPrefix, images } = COMPRESS_CONFIGURATION

/* -------------------------------- Utilities ------------------------------- */

async function compress(path: string, outputFormats: OutputFormat[]): Promise<void> {
	const { width, height }: Metadata = await sharp(path).metadata()

	if (!width || !height) {
		console.error(styleText('red', format('> "%s" has an invalid "width", or "height".', path)))
		return
	}

	console.log(
		'> Optimizing "%s" [~%f KB]...\n',
		nodePath.join(cwd(), path),
		((await fs.stat(path)).size / 1024).toFixed(3)
	)

	const parsedPath: ParsedPath = nodePath.parse(path)

	for (const outputFormat of outputFormats) {
		const outputPath: string = nodePath.join(parsedPath.dir, `${parsedPath.name}.temp.${outputFormat}`)

		if (fsSync.existsSync(outputPath)) await fs.rm(outputPath)

		const output: OutputInfo = await sharp(path)
			[outputFormat]({
				quality: images.outputFormats[outputFormat],
			})
			.toFile(outputPath)

		console.log(
			'> "%s" (%dx%d) [~%f KB]',
			nodePath.join(cwd(), outputPath),
			output.width,
			output.height,
			(output.size / 1024).toFixed(2)
		)
	}

	const rawPath: string = nodePath.join(parsedPath.dir, `${rawPrefix}${parsedPath.base}`)

	await fs.rename(path, rawPath)

	for (const outputFormat of outputFormats) {
		const compressedPath: string = nodePath.join(parsedPath.dir, `${parsedPath.name}.temp.${outputFormat}`)
		const newCompressedPath: string = nodePath.join(parsedPath.dir, `${parsedPath.name}.${outputFormat}`)

		await fs.rename(compressedPath, newCompressedPath)
	}
}

async function compressWithBreakpoints(path: string): Promise<void> {
	const { width, height }: Metadata = await sharp(path).metadata()

	if (!width || !height) {
		console.error(styleText('red', format('> "%s" has an invalid "width", or "height".', path)))
		return
	}

	const sizePerBreakpoint: Readonly<Record<Breakpoint, Readonly<Size>>> = {
		'2xl': {
			width: width - (width - 1536),
			height: Math.round((height / width) * (width - (width - 1536))),
		},

		'xl': {
			width: width - (width - 1280),
			height: Math.round((height / width) * (width - (width - 1280))),
		},

		'lg': {
			width: width - (width - 1024),
			height: Math.round((height / width) * (width - (width - 1024))),
		},

		'md': {
			width: width - (width - 768),
			height: Math.round((height / width) * (width - (width - 768))),
		},

		'sm': {
			width: width - (width - 640),
			height: Math.round((height / width) * (width - (width - 640))),
		},
	}

	console.log(
		'> Optimizing "%s" [~%f KB]...\n',
		nodePath.join(cwd(), path),
		((await fs.stat(path)).size / 1024).toFixed(3)
	)

	const parsedPath: ParsedPath = nodePath.parse(path)

	const outputFormats = Object.keys(images.outputFormats) as OutputFormat[]

	for (let i = 0; i < outputFormats.length; i++) {
		const outputFormat = outputFormats[i]

		if (i) console.log()

		for (const breakpoint in sizePerBreakpoint) {
			const size: Size = sizePerBreakpoint[breakpoint as Breakpoint]

			const outputPath: string = nodePath.join(
				parsedPath.dir,
				`${parsedPath.name}${images.breakpointSep}${breakpoint}.${outputFormat}`
			)

			if (fsSync.existsSync(outputPath)) await fs.rm(outputPath)

			const output: OutputInfo = await sharp(path)
				.resize(size)
				[outputFormat]({
					quality: images.outputFormats[outputFormat],
				})
				.toFile(outputPath)

			console.log(
				'> "%s" (%dx%d) [~%f KB]',
				nodePath.join(cwd(), outputPath),
				output.width,
				output.height,
				(output.size / 1024).toFixed(2)
			)
		}
	}

	const rawPath: string = nodePath.join(parsedPath.dir, `${rawPrefix}${parsedPath.name}${parsedPath.ext}`)

	await fs.rename(path, rawPath)
}

/* ---------------------------------- Main ---------------------------------- */

async function main(): Promise<void> {
	const imgPaths = fs.glob(
		`./public/!(icons)/**/!(${rawPrefix})*[^${images.breakpointSep}]*[^(${Object.keys(BREAKPOINTS).join('|')})].+(${images.extsToCompress.join('|')})`
	)

	let i: number = 0

	for await (const imgPath of imgPaths) {
		if (i) console.log()

		const parsedImgPath = nodePath.parse(imgPath)

		if (parsedImgPath.dir.match(/(open-graphs|screenshots)/)) {
			const rawPath: string = nodePath.join(parsedImgPath.dir, `${rawPrefix}${parsedImgPath.name}${parsedImgPath.ext}`)
			if (fsSync.existsSync(rawPath)) continue

			await compress(imgPath, Object.keys(images.outputFormats) as OutputFormat[])
		} else {
			await compressWithBreakpoints(imgPath)
		}

		i++
	}

	if (!i) console.log('> There is no new public images to compress.')
}

;(async () => await main())()
