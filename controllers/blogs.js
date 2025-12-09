const router = require('express').Router()
const { Blog } = require('../models')

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

router.get('/', async (_req, res) => {
	const blogs = await Blog.findAll()
	res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
	res.json(req.blog)
})

router.post('/', async (req, res, next) => {
	try {
		const blog = await Blog.create(req.body)
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

router.delete('/:id', blogFinder, async (req, res) => {
	await req.blog.destroy()
	res.status(204).end()
})
module.exports = router
