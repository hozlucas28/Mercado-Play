import { useState } from 'react'

type Videos = {
	[x: PropertyKey]: {
		muted: boolean
		volumeIcon: boolean
	}
}

interface SetVideos {
	setKey: (key: PropertyKey, value: Partial<Videos[keyof Videos]>) => void
	toggleMuted: (key: PropertyKey) => void
}

function useVideos<T>(videos: T[], key: (video: T) => PropertyKey): [Videos, SetVideos] {
	const [_videos, _setVideos] = useState(
		videos.reduce<Videos>(
			(prev, current) => ({
				...prev,
				[key(current)]: {
					muted: true,
					volumeIcon: false,
				},
			}),
			{}
		)
	)

	const setVideos: SetVideos = {
		setKey: (key, value) => {
			const newVideos: Videos = structuredClone(_videos)
			newVideos[key] = { ...newVideos[key], ...value }

			_setVideos(newVideos)
		},

		toggleMuted: (key) => {
			const newVideos: Videos = structuredClone(_videos)
			const newValue: boolean = !newVideos[key].muted

			for (const key in newVideos) newVideos[key].muted = true
			newVideos[key].muted = newValue

			_setVideos(newVideos)
		},
	}

	return [_videos, setVideos]
}

export default useVideos
