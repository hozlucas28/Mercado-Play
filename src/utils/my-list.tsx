import { MY_LIST } from '@/constants.ts'

function getMyList(): string[] {
	try {
		return JSON.parse(localStorage.getItem(MY_LIST.storageKey) ?? '[]')
	} catch (error) {
		return []
	}
}

function toggleToMyList(id: string): string[] {
	try {
		const myList: string[] = JSON.parse(localStorage.getItem(MY_LIST.storageKey) ?? '[]')

		const idIndex = myList.indexOf(id)
		idIndex === -1 ? myList.push(id) : myList.splice(idIndex)

		localStorage.setItem(MY_LIST.storageKey, JSON.stringify(myList))

		return myList
	} catch (error) {
		return []
	}
}

export { getMyList, toggleToMyList }
