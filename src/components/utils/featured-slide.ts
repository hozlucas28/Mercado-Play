import type { Slide } from '@/components/featured.tsx'
import { COMPRESS_CONFIGURATION } from '@/constants.ts'

/* ---------------------------------- Types --------------------------------- */

type Device = (typeof COMPRESS_CONFIGURATION.videos.outputDevices)[number]

type VideoType = (typeof COMPRESS_CONFIGURATION.videos.outputFormats)[number]

type CaptionLang = (typeof COMPRESS_CONFIGURATION.videos.captions.langs)[number]

/* ------------------------------ Configuration ----------------------------- */

const {
	breakpointSep: _breakpointSep,
	outputDevices: _outputDevices,
	outputFormats: _outputFormats,
	captions: _captions,
} = COMPRESS_CONFIGURATION.videos

/* ---------------------------------- Logic --------------------------------- */

interface FeaturedSlideParams {
	data: Omit<Slide, 'mobileVideos' | 'desktopVideos' | 'captions'>
	videos: string[]
	captions: string[]
}

function featuredSlide({ data, videos, captions }: FeaturedSlideParams): Slide {
	const slide: Slide = {
		...data,
		mobileVideos: {},
		desktopVideos: {},
		captions: [],
	}

	const videoRegex = `(?:${_breakpointSep})(?<device>${_outputDevices.join('|')})\.(?<type>${_outputFormats.join('|')})$`

	for (const src of videos) {
		const matchResult = src.match(videoRegex)
		if (!matchResult?.groups) continue

		const device = matchResult.groups.device as Device
		const type = matchResult.groups.type as VideoType

		const targetDevice = device === 'mobile' ? slide.mobileVideos : slide.desktopVideos
		targetDevice[type] = src
	}

	const captionRegex = `(?:${_breakpointSep})(?<lang>${_captions.langs.join('|')})\.vtt$`

	for (const src of captions) {
		const matchResult = src.match(captionRegex)
		if (!matchResult?.groups) continue

		const lang = matchResult.groups.lang as CaptionLang

		slide.captions.push({
			kind: 'captions',
			label: lang === 'en' ? 'Inglés' : 'Español',
			src: src,
			srcLang: lang,
		})
	}

	return slide
}

export { featuredSlide }
