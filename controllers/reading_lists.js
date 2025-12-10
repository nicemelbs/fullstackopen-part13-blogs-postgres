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

module.exports = router
