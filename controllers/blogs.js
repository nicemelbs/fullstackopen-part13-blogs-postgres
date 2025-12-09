const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { User, Blog } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')
const escapeRegex = require('../util/escapeRegex')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id)

	if (!req.blog) {
		res
			.status(404)
			.send({ error: `Blog with id=${req.params.id} not found.` })
			.end()
	}
	next()
}

router.get('/', async (req, res) => {
	let where = {}
	if (req.query.search) {
		console.log('searching:', req.query.search)
		const searchRegex = escapeRegex(req.query.search)
		where = {
			[Op.or]: [
				{ title: { [Op.iRegexp]: searchRegex } },
				{ author: { [Op.iRegexp]: searchRegex } },
			],
		}
	}

	const blogs = await Blog.findAll({
		include: {
			model: User,
			attributes: {
				exclude: ['passwordHash', 'userId', 'createdAt', 'updatedAt', 'id'],
			},
		},
		attributes: { exclude: ['userId'] },
		where,
		order: [['likes', 'DESC']],
	})
	res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
	res.json(req.blog)
})

router.post('/', tokenExtractor, async (req, res, next) => {
	try {
		const user = await User.findByPk(req.decodedToken.id)
		const blog = await Blog.create({
			...req.body,
			userId: user.id,
			date: new Date(),
		})
		return res.json(blog)
	} catch (error) {
		res.status(400)
		next(error)
	}
})

router.put('/:id', blogFinder, async (req, res) => {
	if (!req.body?.likes || isNaN(req.body.likes)) {
		res.status(400)
		throw new Error('new `likes` value invalid or missing')
	} else {
		req.blog.likes = Number(req.body.likes)
		await req.blog.save()

		res.status(200).json(req.blog)
	}
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
	const loggedInUserOwnsBlog = req.decodedToken.id === req.blog.userId

	if (loggedInUserOwnsBlog) {
		await req.blog.destroy()
		res.status(204).end()
	} else {
		res.status(403).json({ error: 'Not permitted. You do not own this blog.' })
	}
})
module.exports = router
