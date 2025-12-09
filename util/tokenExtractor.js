const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		try {
			req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
		} catch (error) {
			next(error)
		}
	} else {
		return res.status(401).json({ error: 'You must be logged in to do that.' })
	}

	next()
}

module.exports = tokenExtractor
