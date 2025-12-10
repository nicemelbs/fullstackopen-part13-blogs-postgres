const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { ActiveSession } = require('../models')
const tokenExtractor = async (req, res, next) => {
	const authorization = req.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		try {
			req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

			const activeSession = await ActiveSession.findOne({
				where: { userId: req.decodedToken.id },
			})

			if (!activeSession) {
				return res
					.status(403)
					.json({
						error: 'No active session found. Please try logging in again.',
					})
			}
		} catch (error) {
			next(error)
		}
	} else {
		return res.status(401).json({ error: 'You must be logged in to do that.' })
	}

	next()
}

module.exports = tokenExtractor
