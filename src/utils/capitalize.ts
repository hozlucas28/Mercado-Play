function capitalize(str: string) {
	return str.replace(/\w\S*/g, (word) => {
		return word[0].toUpperCase() + word.slice(1).toLowerCase()
	})
}

export { capitalize }
