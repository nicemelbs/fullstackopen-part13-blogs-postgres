const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')

const tokenExtractor = require('../util/tokenExtractor')

router.get('/', async (req, res) => {
	const users = await User.findAll({
		attributes: { exclude: ['passwordHash'] },
		include: { model: Blog, attributes: { exclude: ['userId'] } },
	})
	res.json(users)
})

router.post('/', async (req, res, next) => {
	const saltRounds = 10
	try {
		const passwordHash = await bcrypt.hash(req.body.password, saltRounds)

		const user = await User.create({ ...req.body, passwordHash })

		res.json(user)
	} catch (error) {
		next(error)
	}
})

router.get('/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id)

	if (user) {
		res.json(user)
	} else {
		res.status(404).end()
	}
})

router.put('/:username', tokenExtractor, async (req, res, next) => {
	try {
		const userToUpdate = await User.findOne({
			where: {
				username: req.params.username,
			},
		})

		const loggedInUserOwnsAccount = userToUpdate.id === req.decodedToken.id

		if (loggedInUserOwnsAccount) {
			userToUpdate.username = req.body.username
			await userToUpdate.save()
			res.status(200).json(userToUpdate)
		} else {
			res.status(403).json({ error: 'Forbidden. You do not own this account.' })
		}
	} catch (error) {
		next(error)
	}
})

module.exports = router
