const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/reading_lists')

const express = require('express')
const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListsRouter)

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(
		`\n${error.name ?? 'UnknownError'}: ${error.message ?? 'Unknown error.'}`
	)

	const errorName = error.name ?? 'UnknownError'

	const errorMessage =
		error.name ?? errorName + typeof error.message === 'string'
			? error.message
			: error.message.join(',')

	res.status(400).json({ error: errorMessage })
	// console.log(JSON.stringify(error, null, 2))
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
