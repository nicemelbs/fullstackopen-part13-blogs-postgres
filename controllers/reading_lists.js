const { ReadingList } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')

const router = require('express').Router()

router.post('/', async (req, res, next) => {
	try {
		const readingList = await ReadingList.create(req.body)
		res.json(readingList)
	} catch (error) {
		next(error)
	}
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
	const listItem = await ReadingList.findByPk(req.params.id)
	if (!listItem) {
		res.status(404).end()
	}
	const loggedInUserOwnsList = req.decodedToken.id === listItem.userId
	if (loggedInUserOwnsList) {
		try {
			listItem.read = req.body.read
			await listItem.save()
			res.json(listItem)
		} catch (error) {
			next(error)
		}
	} else
		res
			.status(403)
			.json({ error: 'FORBIDDEN. This resource is not yours to modify.' })
})

module.exports = router
