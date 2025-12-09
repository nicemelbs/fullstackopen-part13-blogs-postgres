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
	let errorMessage = ''

	switch (error.name) {
		case 'SequelizeValidationError':
			errorMessage += 'Username must be a valid email.'
			break
		case 'SequelizeUniqueConstraintError':
			errorMessage += 'User with this name or email already exists'
			break
		default:
			errorMessage += 'Unknown error'
	}

	console.error(`\n${error.name ?? 'UnknownError'}: ${errorMessage}`)
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
