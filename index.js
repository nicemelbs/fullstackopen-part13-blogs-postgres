const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')

const express = require('express')
const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(`${error.name}: ${error.message}`)
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
