import { BREAKPOINTS, type COMPRESS_CONFIGURATION } from '@/constants.ts'
import type { CarouselApi } from 'ui'
import { Carousel, Heading, ProgressBar } from 'ui'

import { capitalize } from '@/utils/capitalize'
import { IconCirclePlay, IconStarFill } from '@intentui/icons'
import clsx from 'clsx'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import type { ComponentProps } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

/* ---------------------------------- Types --------------------------------- */

type PhotosExt = (typeof COMPRESS_CONFIGURATION.photos.outputFormats)[number]

type PhotosDevices = (typeof COMPRESS_CONFIGURATION.photos.outputDevices)[number]

/* ---------------------------------- Logic --------------------------------- */

interface SlideProps {
	id: string
	anchor: Omit<ComponentProps<'a'>, 'className' | 'aria-label'>
	ariaTitle: string
	type: 'película' | 'serie'

	image: {
		alt: string
		devices: Record<PhotosDevices, Record<PhotosExt, ImageMetadata>>
		prioritizeLoad?: boolean
	}

	score?: number
	title?: string

	date?: {
		value: string
		datetime: string
	}

	progress?: {
		value: number
		position: 'in' | 'out'
	}
}

function Slide({ id, anchor, ariaTitle, type, image, score, title, date, progress }: SlideProps) {
	const progressBarProps = useMemo<ComponentProps<typeof ProgressBar>>(
		() => ({
			'className':
				'absolute bottom-0 left-0 *:min-w-full w-full **:rounded-none *:mt-0 **:data-[slot="progress-content"]:bg-mercado-libre',
			'valueLabel': ' ',
			'aria-label': `${progress?.value}% de 100%`,
			'value': progress?.value,
		}),
		[]
	)

	const sourceProps = useMemo<Record<Exclude<PhotosExt, 'jpg'>, ComponentProps<'source'>>>(
		() => ({
			avif: {
				sizes: `(max-width: ${BREAKPOINTS['sm'] - 1}px) ${BREAKPOINTS['sm'] - 1}w`,
				srcSet: `${image.devices.mobile.avif.src} ${BREAKPOINTS['sm'] - 1}w, ${image.devices.desktop.avif.src} ${BREAKPOINTS['sm']}w`,
				type: 'image/avif',
			},

			webp: {
				sizes: `(max-width: ${BREAKPOINTS['sm'] - 1}px) ${BREAKPOINTS['sm'] - 1}w`,
				srcSet: `${image.devices.mobile.webp.src} ${BREAKPOINTS['sm'] - 1}w, ${image.devices.desktop.webp.src} ${BREAKPOINTS['sm']}w`,
				type: 'image/webp',
			},
		}),
		[]
	)

	const imageProps = useMemo<ComponentProps<'img'>>(
		() => ({
			className: 'aspect-[592/841] w-full',
			alt: image.alt,
			sizes: `(max-width: ${BREAKPOINTS['sm'] - 1}px) ${BREAKPOINTS['sm'] - 1}w`,
			srcSet: `${image.devices.mobile.jpg.src} ${BREAKPOINTS['sm'] - 1}w,  ${image.devices.desktop.jpg.src} ${BREAKPOINTS['sm']}w`,
			width: image.devices.mobile.jpg.width,
			height: image.devices.mobile.jpg.height,
			loading: image.prioritizeLoad ? 'eager' : 'lazy',
			decoding: image.prioritizeLoad ? 'sync' : 'async',
		}),
		[]
	)

	return (
		<Carousel.Item
			id={id}
			className='pointer-events-none basis-1/3 sm:basis-1/4 lg:basis-1/5 xl:basis-1/7'
			textValue={`"${title ?? ariaTitle}": ${capitalize(type)}`}
			aria-label={`"${title ?? ariaTitle}": ${capitalize(type)}`}
		>
			<a
				className='group pointer-events-auto relative flex flex-col gap-4 rounded-lg transition-[background-color] select-none'
				aria-label={`Ver "${title ?? ariaTitle}"`}
				{...anchor}
			>
				<figure className='relative overflow-hidden rounded-lg border transition-[border-bottom-left-radius_border-bottom-right-radius] group-hover:rounded-b-none'>
					<picture>
						{Object.values(sourceProps).map((props) => (
							<source
								key={`${props.srcSet} - Media carousel`}
								{...props}
							/>
						))}
						<img {...imageProps} />
					</picture>

					{progress && (
						<figure
							className='absolute inset-0 size-full place-content-center opacity-0 transition-opacity [grid-template-areas:"stack"] *:size-16 *:[grid-area:stack] group-hover:opacity-100 lg:grid'
							aria-hidden
						>
							<IconCirclePlay className='dark:text-fg text-bg z-10' />
							<span className='bg-fg dark:bg-bg blur-2xl' />
						</figure>
					)}

					{progress && progress.position === 'in' && <ProgressBar {...progressBarProps} />}

					{score && (
						<div
							className='bg-primary/50 text-bg dark:text-fg absolute top-0 -right-21 z-10 mt-1 mr-1 mb-auto ml-auto flex size-fit items-center gap-x-0.5 rounded-full px-2 py-0.5 text-[0.5rem] lining-nums opacity-0 backdrop-blur-xs transition-[right_opacity] group-not-data-[dragging]/carousel-content:group-hover:right-0 group-not-data-[dragging]/carousel-content:group-hover:opacity-100 sm:text-xs lg:gap-x-1 lg:text-sm'
							role='note'
							aria-label={`"${title}" tiene una puntuación de ${score} sobre 10`}
						>
							<IconStarFill
								className='size-2 text-amber-300 sm:size-2.5 lg:size-3'
								aria-hidden
							/>
							<div aria-hidden>
								<span className='mr-px tabular-nums'>{score}</span>
								<span className='mr-px text-[0.35rem] opacity-80 sm:text-[0.5rem] lg:text-[0.625rem]'>/</span>
								<span className='text-[0.35rem] tabular-nums opacity-80 sm:text-[0.5rem] lg:text-[0.625rem]'>10</span>
							</div>
						</div>
					)}
				</figure>

				{progress && progress.position === 'out' && (
					<ProgressBar
						{...progressBarProps}
						className={clsx(progressBarProps.className, 'relative **:rounded-full')}
					/>
				)}

				{(title || date) && (
					<header className='flex flex-col gap-1 sm:px-2 sm:pb-4'>
						{title && (
							<Heading
								className='text-xs! font-medium text-balance opacity-85 sm:text-base! md:text-lg! lg:text-xl!'
								level={4}
							>
								{title}
							</Heading>
						)}
						{date && (
							<time
								className='text-xs text-neutral-500 sm:text-sm md:text-base lg:text-lg'
								dateTime={date.datetime}
							>
								{date.value}
							</time>
						)}
					</header>
				)}
			</a>
		</Carousel.Item>
	)
}

interface Media extends Omit<SlideProps, 'date'> {
	date?: Date
}

interface MediaCarouselProps {
	title: string
	slides: Media[]
	options?: {
		prioritizeRender: boolean
		prioritizeImgLoad: boolean
	}
}

function MediaCarousel({ title, slides, options }: MediaCarouselProps) {
	const [api, setApi] = useState<CarouselApi>()

	const formatter = useMemo(() => new Intl.DateTimeFormat('es', { dateStyle: 'medium' }), [])

	const pointerUpEvent = useCallback((event: NonNullable<UseEmblaCarouselType[1]>) => {
		const $sliderSection = event.containerNode()
		$sliderSection.removeAttribute('data-dragging')
	}, [])

	const pointerDownEvent = useCallback((event: NonNullable<UseEmblaCarouselType[1]>) => {
		const $sliderSection = event.containerNode()
		$sliderSection.setAttribute('data-dragging', '')
	}, [])

	const slidesInViewEvent = useCallback((event: NonNullable<UseEmblaCarouselType[1]>) => {
		const $slider = event.rootNode()

		const slidesLength = event.slideNodes().length
		const slidesInView: number[] = event.slidesInView()

		const hasLeftGradient: boolean = !slidesInView.includes(0)
		const hasRightGradient: boolean = !slidesInView.includes(slidesLength - 1)

		hasLeftGradient ? $slider.setAttribute('data-gradient-left', '') : $slider.removeAttribute('data-gradient-left')
		hasRightGradient ? $slider.setAttribute('data-gradient-right', '') : $slider.removeAttribute('data-gradient-right')
	}, [])

	useEffect(() => {
		if (!api) return

		const $slider = api.rootNode()
		const $sliderContainer = $slider.parentElement as HTMLElement

		$slider.setAttribute('data-gradient-right', '')
		$sliderContainer.removeAttribute('data-initializing')

		api.on('pointerUp', pointerUpEvent)
		api.on('pointerDown', pointerDownEvent)
		api.on('slidesInView', slidesInViewEvent)

		return () => {
			api.off('pointerUp', pointerUpEvent)
			api.off('pointerDown', pointerDownEvent)
			api.off('slidesInView', slidesInViewEvent)
		}
	}, [api])

	return (
		<section
			className={clsx('flex flex-col gap-4', {
				'content-visibility-auto': !options?.prioritizeRender,
			})}
		>
			<header>
				<Heading
					className='text-sm! text-balance sm:text-lg! md:text-xl! lg:text-2xl!'
					level={3}
				>
					{title}
				</Heading>
			</header>

			<Carousel
				className='[&>div[role="listbox"]]:before:from-bg [&>div[role="listbox"]]:after:from-bg relative mb-4 w-full lg:mb-0 [&>div[role="listbox"]]:relative [&>div[role="listbox"]]:before:absolute [&>div[role="listbox"]]:before:top-0 [&>div[role="listbox"]]:before:right-0 [&>div[role="listbox"]]:before:z-1 [&>div[role="listbox"]]:before:h-full [&>div[role="listbox"]]:before:w-24 [&>div[role="listbox"]]:before:bg-gradient-to-l [&>div[role="listbox"]]:before:opacity-100 [&>div[role="listbox"]]:before:transition-opacity [&>div[role="listbox"]]:before:duration-300 [&>div[role="listbox"]]:not-data-[gradient-right]:before:pointer-events-none [&>div[role="listbox"]]:not-data-[gradient-right]:before:opacity-0 [&>div[role="listbox"]]:after:absolute [&>div[role="listbox"]]:after:top-0 [&>div[role="listbox"]]:after:left-0 [&>div[role="listbox"]]:after:z-1 [&>div[role="listbox"]]:after:h-full [&>div[role="listbox"]]:after:w-24 [&>div[role="listbox"]]:after:bg-gradient-to-r [&>div[role="listbox"]]:after:opacity-100 [&>div[role="listbox"]]:after:transition-opacity [&>div[role="listbox"]]:after:duration-300 [&>div[role="listbox"]]:not-data-[gradient-left]:after:pointer-events-none [&>div[role="listbox"]]:not-data-[gradient-left]:after:opacity-0 data-[initializing]:[&>div[role="listbox"]]:before:opacity-100 [&>div[role="listbox"]]:before:sm:w-32 [&>div[role="listbox"]]:after:sm:w-32'
				opts={{
					skipSnaps: true,
					slidesToScroll: 2,
					inViewThreshold: 0.75,
					breakpoints: {
						'(min-width: 1280px)': {
							align: 'start',
						},
					},
				}}
				setApi={setApi}
				data-initializing
			>
				<Carousel.Content
					className='group/carousel-content sm:dark:not-data-dragging:[&>div:hover>a]:bg-muted sm:not-data-dragging:[&>div:hover>a]:bg-muted-fg/10 sm:gap-x-2 lg:gap-x-4'
					aria-label={`Contenido de "${title}"`}
					items={slides}
				>
					{(slide) => (
						<Slide
							{...slide}
							image={{
								...slide.image,
								prioritizeLoad: options?.prioritizeImgLoad,
							}}
							date={
								slide.date && {
									value: formatter.format(slide.date),
									datetime: slide.date.toISOString(),
								}
							}
						/>
					)}
				</Carousel.Content>

				<Carousel.Handler
					className={clsx([
						'hidden lg:flex',
						slides.length < 3 && 'hidden',
						slides.length < 4 && 'sm:hidden',
						slides.length < 5 && 'lg:hidden',
						slides.length < 7 && 'xl:hidden',
					])}
				>
					<Carousel.Button
						segment='previous'
						aria-label='Slide siguiente'
					/>
					<Carousel.Button
						segment='next'
						aria-label='Slide anterior'
					/>
				</Carousel.Handler>
			</Carousel>
		</section>
	)
}

export default MediaCarousel

export type { Media }
