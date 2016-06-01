'use strict'

const data = {}

export const setItem = (key, value) => {
	data[key] = value
}

export const getItem = (key) => {
	return data[key]
}


export default {
	setItem: setItem,
	getItem: getItem
}