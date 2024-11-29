export const get_element_by_ID = document.getElementById


// https://github.com/sindresorhus/type-fest/blob/main/source/snake-cased-properties-deep.d.ts

/** @type {import('npm:type-fest').SnakeCasedPropertiesDeep<typeof document>} */
const _document = new Proxy(document, {
	get(target, p, receiver) {
		const snake_case = String(p).replaceAll(/([A-Z][a-z])/g, (e) => e.charAt(0).toLowerCase() + "_" + e.charAt(1))
		console.log({snake_case, target,p,receiver})
	}

})

console.log(_document.query_selector('hello'))
