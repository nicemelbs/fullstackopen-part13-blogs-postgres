const { ActiveSession } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const router = require('express').Router()

router.get('/', async (req, res) => {
	const authorization = req.get('authorization')
	let decodedToken = null
	if (authorization && authorization.startsWith('Bearer ')) {
		decodedToken = jwt.verify(authorization.substring(7), SECRET)
	}

	if (decodedToken) {
		const userId = decodedToken.id
		await ActiveSession.destroy({ where: { userId } })
	}
	res.json({ success: 'logged out' })
})

module.exports = router
