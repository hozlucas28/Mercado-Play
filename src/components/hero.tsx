import useVideos from '@/components/hooks/use-videos.ts'
import { BREAKPOINTS, type COMPRESS_CONFIGURATION } from '@/constants.ts'
import { getMyList, toggleToMyList } from '@/utils/my-list'
import type { CarouselApi } from 'ui'
import { Button, buttonStyles, Carousel, Heading, Link } from 'ui'

import { IconCheck, IconMute, IconPlus, IconVolumeFull } from '@intentui/icons'
import clsx from 'clsx'
import Autoplay from 'embla-carousel-autoplay'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState, type ComponentProps } from 'react'

interface Poster {
	alt: string
	src: string
}

type Video = Partial<Record<(typeof COMPRESS_CONFIGURATION.videos.outputFormats)[number], string>>

interface Slide {
	id: string
	title: string
	highlight: string
	description: string
	poster: Poster
	mobileVideos: Video
	desktopVideos: Video
	captions: ComponentProps<'track'>[]
	duration: number
	fadeInDelay: number
	fadeOutDelay: number
}

interface HeroProps {
	slides: Slide[]
}

function Hero({ slides }: HeroProps) {
	const [api, setApi] = useState<CarouselApi>()
	const [playing, setPlaying] = useState(Object.fromEntries(slides.map((item) => [item.id, false])))
	const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([])
	const [intersecting, setIntersecting] = useState(false)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [myList, setMyList] = useState(getMyList())

	const [videos, setVideos] = useVideos(slides, (item) => item.id)

	const autoPlay = useRef(
		Autoplay({
			delay: () => slides.reduce<number[]>((prev, current) => [...prev, current.fadeInDelay + current.duration], []),
		})
	)

	const fadeInOut = useCallback(
		(api: NonNullable<CarouselApi>) => {
			const $slides: HTMLElement[] = api.slideNodes()
			const _currentSlide: number = api.selectedScrollSnap()

			const slide = {
				id: $slides[_currentSlide].getAttribute('data-id') as string,
				ref: $slides[_currentSlide],
				timeout: $slides[_currentSlide].getAttribute('data-timeout') === 'true' ? true : false,

				video: {
					ref: $slides[_currentSlide].querySelector('video') as HTMLVideoElement,
					duration: slides[_currentSlide].duration,
					fadeInDelay: slides[_currentSlide].fadeInDelay,
					fadeOutDelay: slides[_currentSlide].fadeOutDelay,
				},
			} as const

			if (slide.timeout) return

			for (const timeout of timeouts) {
				clearTimeout(timeout)
			}

			const _playing: Record<string, boolean> = Object.fromEntries(slides.map((item) => [item.id, false]))

			for (const $slide of $slides) {
				const id = $slide.getAttribute('data-id') as string
				const $video = $slide.querySelector('video') as HTMLVideoElement

				$video.pause()
				$video.currentTime = 0
				$slide.setAttribute('data-timeout', 'false')

				_playing[id] = false
			}

			setPlaying(() => _playing)

			slide.ref.setAttribute('data-timeout', 'true')

			const fadeIn = setTimeout(() => {
				if (_currentSlide !== api.selectedScrollSnap()) return

				slide.video.ref.play()

				setPlaying((prev) => ({ ...prev, [slide.id]: true }))

				const steps: number = 50
				const duration: number = parseInt(slide.video.ref.getAttribute('data-fade-in-out') as string)
				const interval: number = duration / steps
				const increment: number = 1 / steps

				const fadeInVolume = setInterval(() => {
					const newVolume: number = slide.video.ref.volume + increment

					if (newVolume < 1) {
						slide.video.ref.volume = Math.min(1, newVolume)
						return
					}

					slide.video.ref.volume = 1
					// @ts-ignore
					clearInterval(fadeInVolume)
				}, interval)
			}, slide.video.fadeInDelay)

			const fadeOut = setTimeout(
				() => {
					setPlaying((prev) => ({ ...prev, [slide.id]: false }))

					const steps: number = 50
					const duration: number = parseInt(slide.video.ref.getAttribute('data-fade-in-out') as string)
					const interval: number = duration / steps
					const decrement: number = slide.video.ref.volume / steps

					const fadeOutVolume = setInterval(() => {
						const newVolume: number = slide.video.ref.volume - decrement

						if (newVolume > 0) {
							slide.video.ref.volume = Math.max(0, newVolume)
							return
						}

						slide.video.ref.pause()
						slide.video.ref.volume = 0
						// @ts-ignore
						clearInterval(fadeOutVolume as NodeJS.Timeout)
					}, interval)
				},
				slide.video.fadeInDelay + slide.video.duration - slide.video.fadeOutDelay
			)

			setTimeouts([fadeIn, fadeOut])
		},
		[timeouts]
	)

	const handleAPISelect = useCallback((event: NonNullable<UseEmblaCarouselType[1]>) => {
		const _currentSlide: number = event.selectedScrollSnap()
		fadeInOut(event)
		setCurrentSlide(_currentSlide)
	}, [])

	const handleSaveToList = useCallback((slide: Slide) => {
		const newMyList: string[] = toggleToMyList(slide.id)
		setMyList(newMyList)
	}, [])

	const handleSelectSlide = useCallback((api: NonNullable<CarouselApi>, selectedSlide: number) => {
		api.scrollTo(selectedSlide)
		setCurrentSlide(selectedSlide)
	}, [])

	useEffect(() => {
		if (!api) return

		const $slides: HTMLElement[] = api.slideNodes()

		const intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (intersecting !== entry.isIntersecting) {
						setIntersecting(entry.isIntersecting)

						if (entry.isIntersecting) {
							fadeInOut(api)
							return
						}

						const slide = {
							id: $slides[_currentSlide].getAttribute('data-id') as string,
							ref: $slides[_currentSlide],
							timeout: $slides[_currentSlide].getAttribute('data-timeout') === 'true' ? true : false,

							video: {
								ref: $slides[_currentSlide].querySelector('video') as HTMLVideoElement,
								duration: slides[_currentSlide].duration,
								fadeInDelay: slides[_currentSlide].fadeInDelay,
								fadeOutDelay: slides[_currentSlide].fadeOutDelay,
							},
						} as const

						for (const timeout of timeouts) {
							clearTimeout(timeout)
						}

						const _playing = { ...playing }

						for (const $slide of $slides) {
							const id = $slide.getAttribute('data-id') as string
							const $video = $slide.querySelector('video') as HTMLVideoElement

							$video.pause()
							$video.currentTime = 0
							$slide.setAttribute('data-timeout', 'false')

							_playing[id] = false
						}

						setPlaying(() => _playing)

						const fadeOut = setTimeout(
							() => {
								setPlaying((prev) => ({ ...prev, [slide.id]: false }))

								const steps: number = 50
								const duration: number = parseInt(slide.video.ref.getAttribute('data-fade-in-out') as string)
								const interval: number = duration / steps
								const decrement: number = slide.video.ref.volume / steps

								const fadeOutVolume = setInterval(() => {
									const newVolume: number = slide.video.ref.volume - decrement

									if (newVolume > 0) {
										slide.video.ref.volume = Math.max(0, newVolume)
										return
									}

									slide.video.ref.pause()
									slide.video.ref.volume = 0
									// @ts-ignore
									clearInterval(fadeOutVolume as NodeJS.Timeout)
								}, interval)
							},
							slide.video.fadeInDelay + slide.video.duration - slide.video.fadeOutDelay
						)

						setTimeouts([fadeOut])
					}
				})
			},
			{ threshold: 0.8 }
		)

		const $carousel: HTMLElement = api.rootNode()
		const _currentSlide = api.selectedScrollSnap()

		intersectionObserver.observe($carousel)
		api.on('select', handleAPISelect)

		setCurrentSlide(_currentSlide)

		return () => {
			intersectionObserver.disconnect()
			api.off('select', handleAPISelect)
		}
	}, [api, intersecting, playing, timeouts, videos])

	useEffect(() => {
		if (!api) return

		const $slides: HTMLElement[] = api.slideNodes()
		const slides: string[] = $slides.map((slide) => slide.getAttribute('data-id') as string)

		for (const id in videos) {
			if (!videos[id].muted) setVideos.toggleMuted(slides[currentSlide])
		}
	}, [currentSlide])

	let i: number = -1

	return (
		<>
			<Carousel
				className='mb-4 select-none sm:mb-6 lg:mb-12'
				opts={{ loop: true, slidesToScroll: 1 }}
				setApi={setApi}
				plugins={[autoPlay.current]}
				onMouseEnter={autoPlay.current.stop}
				onMouseLeave={autoPlay.current.reset}
			>
				<Carousel.Content
					aria-label='Películas y series destacadas'
					items={slides}
					dependencies={[myList, videos, playing]}
				>
					{(slide) => {
						i++

						return (
							<Carousel.Item
								id={slide.id}
								textValue={`${slide.highlight}: "${slide.title}"`}
								aria-label={playing[slide.id] ? `${videos[slide.id].muted ? 'Activar' : 'Silenciar'} sonido` : ''}
								data-id={slide.id}
								onAction={() => setVideos.toggleMuted(slide.id)}
							>
								<article className='pointer-events-none relative aspect-video overflow-hidden rounded-lg border transition-[border-color]'>
									{/* Overlay */}
									<div className='absolute inset-0 grid w-full grid-cols-[1fr_3rem] p-2 sm:p-3 lg:grid-cols-[1fr_6rem] lg:p-7 lg:pt-3.5 lg:pr-3.5'>
										<div className='mt-auto'>
											<header className='*:before:bg-fg dark:*:before:bg-bg relative flex w-full flex-col gap-1 *:relative *:w-fit *:before:absolute *:before:-top-2 *:before:-left-6 *:before:-z-[1] *:before:block *:before:h-[calc(100%_+_1rem)] *:before:w-[calc(100%_+_3rem)] *:before:blur-2xl *:before:sm:blur-3xl lg:gap-4'>
												<span className='dark:text-fg text-bg bg-highlight/50 relative w-fit rounded-full px-2 text-[0.5rem] font-medium sm:text-xs lg:px-4 lg:text-base'>
													{slide.highlight}
												</span>
												<Heading
													className='dark:text-fg text-bg relative flex w-fit text-balance sm:text-2xl lg:text-4xl'
													tracking='wider'
													level={i ? 2 : 1}
												>
													{slide.title}
												</Heading>
												<div>
													<p className='dark:text-fg/80 text-bg/80 line-clamp-2 text-sm font-normal text-pretty sm:text-lg lg:text-2xl'>
														{slide.description}
													</p>
												</div>
											</header>
											<footer className='mt-4 flex w-full gap-2.5 lg:mt-7'>
												<Link
													className={(renderProps) =>
														buttonStyles({
															...renderProps,
															className:
																'inset-ring-bg/15! pointer-events-auto h-7 min-w-32 rounded-full p-1 text-xs shadow-none! sm:h-8 sm:min-w-42 lg:h-12 lg:min-w-72 lg:text-2xl',
														})
													}
													href='/'
												>
													Ver ahora
												</Link>
												<Button
													className='text-bg dark:text-fg pressed:bg-neutral-800 inset-ring-bg/15! dark:inset-ring-fg/15! pointer-events-auto relative size-7 rounded-full bg-neutral-700/95 p-1 shadow-none! hover:bg-neutral-700 sm:size-8 lg:size-12'
													intent='secondary'
													aria-label={`${myList.includes(slide.id) ? 'Quitar' : 'Añadir'} "${slide.title}" ${myList.includes(slide.id) ? 'de' : 'a'} mi lista`}
													onPress={() => handleSaveToList(slide)}
												>
													<IconCheck
														className={`absolute size-3 transition-[scale,_rotate,_opacity] lg:size-5 ${
															myList.includes(slide.id)
																? 'scale-100 rotate-0 opacity-100'
																: 'scale-0 -rotate-90 opacity-0'
														}`}
													/>

													<IconPlus
														className={`absolute size-3 transition-[scale,_rotate,_opacity] lg:size-5 ${
															myList.includes(slide.id)
																? 'scale-0 -rotate-90 opacity-0'
																: 'scale-100 rotate-0 opacity-100'
														}`}
													/>
												</Button>
											</footer>
										</div>
										<figure
											className={clsx(
												'dark:text-fg/50 text-bg/50 dark:before:bg-bg before:bg-fg relative ml-auto size-6 transition-opacity delay-400 duration-600 ease-in-out before:absolute before:-top-1.5 before:-left-2 before:-z-[1] before:block before:size-[calc(100%_+_1rem)] before:blur-2xl md:size-7 lg:size-8',
												playing[slide.id] && videos[slide.id].volumeIcon ? 'opacity-100' : 'opacity-0'
											)}
											aria-hidden
										>
											<IconMute
												className={`absolute size-full transition-[scale,opacity] ${videos[slide.id].muted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
											/>
											<IconVolumeFull
												className={`absolute size-full transition-[scale,opacity] ${!videos[slide.id].muted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
											/>
										</figure>
									</div>

									{/* Video */}
									<div className='relative -z-10 size-full'>
										<video
											className='absolute top-0 left-0 size-full object-cover'
											muted={videos[slide.id].muted}
											poster={slide.poster.src}
											preload='metadata'
											aria-hidden
											data-fade-in-out='675'
											loop
											playsInline
											onPlay={() => setVideos.setKey(slide.id, { volumeIcon: true })}
										>
											{Object.entries(slide.mobileVideos)
												.sort((a, b) => b[0].localeCompare(a[0]))
												.map(([type, src]) => (
													<source
														key={`${src} - Hero media (mobile)`}
														src={src}
														type={`video/${type}`}
														media={`(max-width: ${BREAKPOINTS['sm'] - 1}px)`}
													/>
												))}
											{Object.entries(slide.desktopVideos)
												.sort((a, b) => b[0].localeCompare(a[0]))
												.map(([type, src]) => (
													<source
														key={`${src} - Hero media (desktop)`}
														src={src}
														type={`video/${type}`}
													/>
												))}
											{slide.captions.map((props) => (
												<track
													key={`${props.src} - Caption (${props.srcLang})`}
													{...props}
												/>
											))}
										</video>

										<img
											className={clsx(
												'absolute top-0 left-0 size-full object-cover transition-opacity duration-675 ease-in-out',
												!playing[slide.id] ? 'opacity-100' : 'opacity-0'
											)}
											alt={slide.poster.alt}
											src={slide.poster.src}
											loading={i ? 'lazy' : 'eager'}
											decoding={i ? 'async' : 'sync'}
											aria-hidden={playing[slide.id]}
										/>
									</div>
								</article>
							</Carousel.Item>
						)
					}}
				</Carousel.Content>

				<div className='my-1.5 flex justify-end gap-1'>
					{slides.map((_slide, _index) => {
						return (
							<Button
								key={`${_slide.title} - Select button`}
								className={clsx(
									'h-5 rounded-full p-0 transition-[width] focus:outline-hidden',
									currentSlide === _index ? 'w-10' : 'w-5'
								)}
								intent={currentSlide === _index ? 'secondary' : 'outline'}
								aria-label={`Seleccionar slide de "${_slide.title}"`}
								onPress={() => api && handleSelectSlide(api, _index)}
							/>
						)
					})}
				</div>
			</Carousel>
		</>
	)
}

export default Hero

export type { Slide }
