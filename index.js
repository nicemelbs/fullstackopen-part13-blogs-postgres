const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const express = require('express')
const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(
		`\n${error.name ?? 'UnknownError'}: ${error.message ?? 'Unknown error.'}`
	)

	const errorMessage =
		error.errors?.map((e) => e.message).join('\n') ?? 'Unknown error'

	let statusCode = 400
	switch (error.name) {
		case 'SequelizeValidationError':
			statusCode = 400
			break
		case 'SequelizeUniqueConstraintError':
			statusCode = 400
			break
		default:
			statusCode = 400
	}

	res.status(statusCode).json({ error: errorMessage })
	console.log(JSON.stringify(error, null, 2))
	next()
}
app.use(errorHandler)

const start = async () => {
	await connectToDatabase()
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
	app.on('error', (error) => {
		console.error('Server error:', error)
	})
}

start()
