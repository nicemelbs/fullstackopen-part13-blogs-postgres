require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
	await sequelize.authenticate()

	const blogs = await sequelize.query('SELECT * FROM blogs', {
		type: QueryTypes.SELECT,
	})

	printBlogs(blogs)
}

const printBlogs = (blogs) => {
	blogs.map((blog) => {
		console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
	})
}

main()
