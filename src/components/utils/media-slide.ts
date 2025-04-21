import type { Media } from '@/components/media-carousel.tsx'
import { COMPRESS_CONFIGURATION } from '@/constants.ts'

/* ---------------------------------- Types --------------------------------- */

type Device = (typeof COMPRESS_CONFIGURATION.photos.outputDevices)[number]

type PhotoType = (typeof COMPRESS_CONFIGURATION.photos.outputFormats)[number]

interface MediaData extends Omit<Media, 'image'> {
	image: Omit<Media['image'], 'devices'>
}

/* ------------------------------ Configuration ----------------------------- */

const {
	breakpointSep: _breakpointSep,
	outputDevices: _outputDevices,
	outputFormats: _outputFormats,
} = COMPRESS_CONFIGURATION.photos

/* ---------------------------------- Logic --------------------------------- */

function mediaSlide(data: MediaData, images: ImageMetadata[]): Media {
	const slide = {
		...data,

		image: {
			...data.image,

			devices: {
				mobile: {},
				desktop: {},
			},
		},
	} as Media

	const photoRegex = `(?:${_breakpointSep})(?<device>${_outputDevices.join('|')})(?:\.[^.]+)?\.(?<type>${_outputFormats.join('|')})`

	for (const image of images) {
		const matchResult = image.src.match(photoRegex)
		if (!matchResult?.groups) continue

		const device = matchResult.groups.device as Device
		const type = matchResult.groups.type as PhotoType

		slide.image.devices[device][type] = image
	}

	return slide
}

export { mediaSlide }

export type { MediaData }
