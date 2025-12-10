const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../util/config')
const { User, ActiveSession } = require('../models')

router.post('/', async (req, res) => {
	const body = req.body
	const user = await User.findOne({
		where: {
			username: body.username,
		},
	})

	console.log('user logging in:', user)

	const passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: 'Invalid credentials',
		})
	}

	if (user.disabled) {
		await ActiveSession.destroy({ where: { userId: user.id } })
		return res.status(401).json({
			error: 'Account disabled. Please contact an admin.',
		})
	}

	const activeSession = await ActiveSession.findOne({
		where: { userId: user.id },
	})
	if (!activeSession) {
		await ActiveSession.create({ userId: user.id })
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	}

	const token = jwt.sign(userForToken, SECRET)

	res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
