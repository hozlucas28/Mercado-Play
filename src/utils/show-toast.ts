import { DEFAULT_TOASTS_STORAGE_KEY } from '@/constants'
import type { ToastsStorage } from '@/types'
import { toast } from 'sonner'

type Options =
	| {
			oneTime: boolean
	  }
	| {
			oneTime: true
			untilManualClose: true
	  }

function showToast(message: Parameters<typeof toast>[0]): void

function showToast(
	message: Parameters<typeof toast>[0],
	data: NonNullable<Parameters<typeof toast>[1]>
): void

function showToast(
	message: Parameters<typeof toast>[0],
	data: NonNullable<Parameters<typeof toast>[1]> & { id: string },
	options: Options
): void

function showToast(
	message: Parameters<typeof toast>[0],
	data?:
		| Omit<NonNullable<Parameters<typeof toast>[1]>, 'id'>
		| (Omit<NonNullable<Parameters<typeof toast>[1]>, 'id'> & { id: string }),
	options?: Options
): void {
	if (!data) {
		toast(message)
		return
	}

	if (!('id' in data) || !options || !options.oneTime) {
		toast(message, data)
		return
	}

	const toastsStorage: ToastsStorage = Object.assign<
		ToastsStorage,
		ToastsStorage
	>(
		{ displayed: [] },
		JSON.parse(localStorage.getItem(DEFAULT_TOASTS_STORAGE_KEY) ?? '{}')
	)

	if (toastsStorage.displayed.includes(data.id)) return

	'untilManualClose' in options && (data.duration = Infinity)

	const onClose = () => {
		const toastsStorage: ToastsStorage = Object.assign<
			ToastsStorage,
			ToastsStorage
		>(
			{ displayed: [] },
			JSON.parse(localStorage.getItem(DEFAULT_TOASTS_STORAGE_KEY) ?? '{}')
		)

		toastsStorage.displayed.push(data.id)
		localStorage.setItem(
			DEFAULT_TOASTS_STORAGE_KEY,
			JSON.stringify(toastsStorage)
		)
	}

	const _onAutoClose = data.onAutoClose

	data.onAutoClose = (...params) => {
		_onAutoClose && _onAutoClose(...params)
		onClose()
	}

	const _onDismiss = data.onDismiss

	data.onDismiss = (...params) => {
		_onDismiss && _onDismiss(...params)
		onClose()
	}

	toast(message, data)
}

export default showToast
