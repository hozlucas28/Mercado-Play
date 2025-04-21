import { useMediaQuery } from '@/utils/use-media-query.ts'

import type { PWAInstallElement } from '@khmyznikov/pwa-install'
import { useCallback, useEffect, useState } from 'react'

function usePWA(): [boolean, () => Promise<void>] {
	const isMobile = useMediaQuery('(max-width: 1024px)')
	const [isInstalled, setIsInstalled] = useState(false)

	const promptInstallation = useCallback(async () => {
		if (isInstalled) return

		const $pwaInstall = document.getElementsByTagName('pwa-install')[0] as PWAInstallElement

		$pwaInstall.showDialog(true)
	}, [])

	const installSuccessEventListener = useCallback(() => setIsInstalled(true), [])

	useEffect(() => {
		const $pwaInstall = document.getElementsByTagName('pwa-install')[0] as PWAInstallElement

		setIsInstalled(!$pwaInstall.isInstallAvailable && !isMobile)
		$pwaInstall.addEventListener('pwa-install-success-event', installSuccessEventListener)

		return () => {
			$pwaInstall.removeEventListener('pwa-install-success-event', installSuccessEventListener)
		}
	}, [isMobile])

	return [isInstalled, promptInstallation]
}

export { usePWA }
