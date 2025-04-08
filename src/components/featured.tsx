import useVideos from '@/components/hooks/use-videos.ts'
import { BREAKPOINTS } from '@/constants.ts'
import { getMyList, toggleToMyList } from '@/utils/my-list'
import { Button, buttonStyles, Carousel, Heading, Link, type CarouselApi } from 'ui'

import { IconCheck, IconMute, IconPlus, IconVolumeFull } from '@intentui/icons'
import clsx from 'clsx'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

interface Poster {
	alt: string
	src: string
}

interface Video {
	src: string
	type: 'webm' | 'mp4'
}

interface CarouselItem {
	id: string
	title: string
	highlight: string
	description: string
	poster: Poster
	mobileVideos: Video[]
	desktopVideos: Video[]
	captions: ComponentProps<'track'>[]
	duration: number
	fadeInDelay: number
	fadeOutDelay: number
}

interface FeaturedProps {
	items: CarouselItem[]
}

function Featured({ items }: FeaturedProps) {
	const [api, setApi] = useState<CarouselApi>()
	const [myList, setMyList] = useState(getMyList())

	const [slide, setSlide] = useState(1)
	const [videos, setVideos] = useVideos(items, (item) => item.id)
	const [playing, setPlaying] = useState(Object.fromEntries(items.map((item) => [item.id, false])))
	const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([])
	const [intersecting, setIntersecting] = useState(false)

	const autoPlay = useRef(
		Autoplay({
			delay: () => items.reduce<number[]>((prev, current) => [...prev, current.fadeInDelay + current.duration], []),
		})
	)

	useEffect(() => {
		if (!api) return

		const $slides: HTMLElement[] = api.slideNodes()

		const fadeInOut = (index: number) => {
			const slide = {
				id: $slides[index].getAttribute('data-id') as string,
				ref: $slides[index],
				timeout: $slides[index].getAttribute('data-timeout') === 'true' ? true : false,

				video: {
					ref: $slides[index].querySelector('video') as HTMLVideoElement,
					duration: items[index].duration,
					fadeInDelay: items[index].fadeInDelay,
					fadeOutDelay: items[index].fadeOutDelay,
				},
			} as const

			if (!slide.timeout) {
				for (const timeout of timeouts) clearTimeout(timeout)

				const _playing = { ...playing }

				for (const $slide of $slides) {
					const id = $slide.getAttribute('data-id') as string
					const $video = $slide.querySelector('video') as HTMLVideoElement

					$video.pause()
					$video.volume = 0
					$video.currentTime = 0
					$slide.setAttribute('data-timeout', 'false')

					_playing[id] = false
				}

				setPlaying(_playing)

				slide.ref.setAttribute('data-timeout', 'true')

				const fadeIn = setTimeout(() => {
					slide.video.ref.play()
					slide.video.ref.volume = 0

					setPlaying((prev) => ({ ...prev, [slide.id]: true }))

					const steps: number = 50
					const duration: number = parseInt(slide.video.ref.getAttribute('data-fade-in-out') as string)
					const interval: number = duration / steps
					const increment: number = 1 / steps

					const fadeInVolume = setInterval(() => {
						const newVolume: number = slide.video.ref.volume + increment

						if (newVolume < 1) {
							slide.video.ref.volume = Math.max(1, newVolume)
						} else {
							slide.video.ref.volume = 1
							clearInterval(fadeInVolume as NodeJS.Timeout)
						}
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
							} else {
								slide.video.ref.pause()
								slide.video.ref.volume = 0
								slide.video.ref.currentTime = 0
								clearInterval(fadeOutVolume as NodeJS.Timeout)
							}
						}, interval)
					},
					slide.video.fadeInDelay + slide.video.duration - slide.video.fadeOutDelay
				)

				setTimeouts([fadeIn, fadeOut])
			}
		}

		const index = api.selectedScrollSnap()

		const intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setIntersecting(entry.isIntersecting)
					if (entry.isIntersecting) return

					const slide = {
						id: $slides[index].getAttribute('data-id') as string,
						ref: $slides[index],
						timeout: $slides[index].getAttribute('data-timeout') === 'true' ? true : false,

						video: {
							ref: $slides[index].querySelector('video') as HTMLVideoElement,
							duration: items[index].duration,
							fadeInDelay: items[index].fadeInDelay,
							fadeOutDelay: items[index].fadeOutDelay,
						},
					} as const

					for (const timeout of timeouts) clearTimeout(timeout)

					const _playing = { ...playing }

					for (const $slide of $slides) {
						const id = $slide.getAttribute('data-id') as string
						const $video = $slide.querySelector('video') as HTMLVideoElement

						$video.pause()
						$video.volume = 0
						$video.currentTime = 0
						$slide.setAttribute('data-timeout', 'false')

						_playing[id] = false
					}

					setPlaying(_playing)

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
								} else {
									slide.video.ref.pause()
									slide.video.ref.volume = 0
									slide.video.ref.currentTime = 0
									clearInterval(fadeOutVolume as NodeJS.Timeout)
								}
							}, interval)
						},
						slide.video.fadeInDelay + slide.video.duration - slide.video.fadeOutDelay
					)

					setTimeouts([fadeOut])
				})
			},
			{ threshold: 0.5 }
		)

		const $carousel: HTMLElement = api.rootNode()

		intersectionObserver.observe($carousel)

		fadeInOut(index)
		setSlide(index)

		api.on('select', (event) => {
			const index = event.selectedScrollSnap()

			fadeInOut(index)
			setSlide(index)
		})

		return () => intersectionObserver.disconnect()
	}, [api, intersecting, playing, timeouts])

	useEffect(() => {
		if (!api) return

		const index: number = api.selectedScrollSnap()
		const slides: string[] = api.slideNodes().map((slide) => slide.getAttribute('data-id') ?? '')

		for (const key in videos) {
			if (!videos[key].muted) setVideos.toggleMuted(slides[index])
		}
	}, [slide])

	const handleSaveToList = ({ id }: CarouselItem) => {
		const newMyList = toggleToMyList(id)
		setMyList(newMyList)
	}

	const handleSelect = (index: number) => {
		if (!api) return

		api.scrollTo(index)
		setSlide(index)
	}

	let i: number = -1

	return (
		<>
			<Carousel
				className='**:select-none'
				opts={{ loop: true, slidesToScroll: 1 }}
				setApi={setApi}
				plugins={[autoPlay.current]}
				onMouseEnter={autoPlay.current.stop}
				onMouseLeave={autoPlay.current.reset}
			>
				<Carousel.Content
					aria-label='Películas y series destacadas'
					items={items}
					dependencies={[myList, videos, playing]}
				>
					{(item) => {
						i++

						return (
							<Carousel.Item
								id={item.id}
								aria-label={item.highlight}
								data-id={item.id}
								onAction={() => setVideos.toggleMuted(item.id)}
							>
								<article className='pointer-events-none relative aspect-video overflow-hidden rounded-lg border'>
									{/* Overlay */}
									<div className='absolute inset-0 grid w-full grid-cols-[1fr_3rem] p-2 sm:p-3 lg:grid-cols-[1fr_6rem] lg:p-7 lg:pt-3.5 lg:pr-3.5'>
										<div className='mt-auto'>
											<header className='relative flex w-full flex-col gap-1 *:relative *:w-fit *:before:absolute *:before:-top-2 *:before:-left-6 *:before:-z-[1] *:before:block *:before:h-[calc(100%_+_1rem)] *:before:w-[calc(100%_+_3rem)] *:before:bg-neutral-950 *:before:blur-2xl *:before:sm:blur-3xl lg:gap-4'>
												<span className='dark:text-fg text-bg bg-highlight/50 relative w-fit rounded-full px-2 text-[0.5rem] font-medium lg:px-4 lg:text-base'>
													{item.highlight}
												</span>
												<Heading
													className='dark:text-fg text-bg relative flex w-fit sm:text-2xl lg:text-4xl'
													tracking='wider'
													level={i ? 2 : 1}
												>
													{item.title}
												</Heading>
												<div>
													<p className='dark:text-fg/80 text-bg/80 line-clamp-2 text-xs font-normal sm:text-lg lg:text-2xl'>
														{item.description}
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
													className='text-bg dark:text-fg pressed:bg-neutral-800 inset-ring-bg/15! dark:inset-ring-fg/15! pointer-events-auto relative size-7 rounded-full bg-neutral-700/95 p-1 shadow-none! *:absolute *:size-3! *:transition-all hover:bg-neutral-700 sm:size-8 lg:size-12 *:lg:size-5!'
													intent='secondary'
													aria-label={`${myList.includes(item.id) ? 'Quitar' : 'Añadir'} "${item.title}" ${myList.includes(item.id) ? 'de' : 'a'} mi lista`}
													onPress={() => handleSaveToList(item)}
												>
													<IconCheck
														className={
															myList.includes(item.id)
																? 'scale-100 rotate-0 opacity-100'
																: 'scale-0 -rotate-90 opacity-0'
														}
													/>

													<IconPlus
														className={
															myList.includes(item.id)
																? 'scale-0 -rotate-90 opacity-0'
																: 'scale-100 rotate-0 opacity-100'
														}
													/>
												</Button>
											</footer>
										</div>
										<figure
											className={clsx(
												'dark:text-fg/50 text-bg/50 relative ml-auto size-4 transition-opacity delay-400 duration-600 ease-in-out *:absolute *:size-full *:transition-all before:absolute before:-top-1.5 before:-left-2 before:-z-[1] before:block before:size-[calc(100%_+_1rem)] before:bg-neutral-950 before:blur-2xl sm:size-6 md:size-7 lg:size-8',
												playing[item.id] && videos[item.id].volumeIcon ? 'opacity-100' : 'opacity-0'
											)}
											aria-hidden='true'
										>
											<IconMute className={videos[item.id].muted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} />
											<IconVolumeFull
												className={!videos[item.id].muted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
											/>
										</figure>
									</div>

									{/* Video */}
									<div className='relative -z-10 size-full'>
										<video
											className='absolute top-0 left-0 size-full object-cover'
											muted={videos[item.id].muted}
											poster={item.poster.src}
											preload='metadata'
											aria-hidden={!playing[item.id]}
											data-fade-in-out='1000'
											loop
											playsInline
											onPlay={() => setVideos.setKey(item.id, { volumeIcon: true })}
										>
											{item.mobileVideos.map(({ src, type }) => (
												<source
													key={`${src} - Featured (mobile)`}
													src={src}
													type={`video/${type}`}
													media={`(max-width: ${BREAKPOINTS['md']}px)`}
												/>
											))}
											{item.desktopVideos.map(({ src, type }) => (
												<source
													key={`${src} - Featured (desktop)`}
													src={src}
													type={`video/${type}`}
												/>
											))}
											{item.captions.map((props) => (
												<track
													key={`${props.src} - Caption (${props.srcLang})`}
													{...props}
												/>
											))}
										</video>

										<img
											className={clsx(
												'absolute top-0 left-0 size-full object-cover transition-opacity duration-1000 ease-in-out',
												!playing[item.id] ? 'opacity-100' : 'opacity-0'
											)}
											alt={item.poster.alt}
											src={item.poster.src}
										/>
									</div>
								</article>
							</Carousel.Item>
						)
					}}
				</Carousel.Content>

				<div className='my-1.5 flex justify-end gap-1'>
					{items.map((item, index) => {
						return (
							<Button
								key={`${item.title} - Select button`}
								className={clsx(
									'h-5 rounded-full p-0 transition-all focus:outline-hidden',
									slide === index ? 'w-10' : 'w-5'
								)}
								intent={slide === index ? 'secondary' : 'outline'}
								aria-label={`Seleccionar slide de "${item.title}"`}
								onPress={() => handleSelect(index)}
							/>
						)
					})}
				</div>
			</Carousel>
		</>
	)
}

export default Featured

export type { CarouselItem }
