const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const ActiveSession = require('./active_session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'subscribed_readers' })

User.hasOne(ActiveSession)
ActiveSession.belongsTo(User)

module.exports = { Blog, User, ReadingList, ActiveSession }
