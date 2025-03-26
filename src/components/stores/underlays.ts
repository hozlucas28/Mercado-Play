import { map } from 'nanostores'

interface Underlays {
	menu: boolean
	sideNavbar: boolean
	commandMenu: boolean
}

const underlaysStore = map<Underlays>({
	menu: false,
	sideNavbar: false,
	commandMenu: false,
})

export { underlaysStore }
