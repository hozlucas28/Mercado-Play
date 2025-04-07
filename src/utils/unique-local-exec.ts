interface LocalExecs {
	pending: string[]
	executed: string[]
}

interface Options {
	id: string
	localStorageID: string
}

function uniqueLocalExec<T>(
	callback: (id: string, setExecuted: () => void) => T,
	options: Options
): (() => T) | undefined {
	const { id, localStorageID } = options

	try {
		const localExecs = Object.assign<LocalExecs, LocalExecs>(
			{
				pending: [],
				executed: [],
			},
			JSON.parse(localStorage.getItem(localStorageID) ?? '{}')
		)

		if (localExecs.executed.includes(id)) return

		const setExecuted = () => {
			const localExecs = Object.assign<LocalExecs, LocalExecs>(
				{
					pending: [],
					executed: [],
				},
				JSON.parse(localStorage.getItem(localStorageID) ?? '{}')
			)

			for (let i = 0; i < localExecs.pending.length; i++) {
				if (localExecs.pending[i] === id) {
					localExecs.pending.splice(i)
					break
				}
			}

			localExecs.executed.push(id)
			localStorage.setItem(localStorageID, JSON.stringify(localExecs))
		}

		if (!localExecs.pending.includes(id)) {
			localExecs.pending.push(id)
			localStorage.setItem(localStorageID, JSON.stringify(localExecs))
		}

		return () => callback(id, setExecuted)
	} catch (error) {}
}

export { uniqueLocalExec }
