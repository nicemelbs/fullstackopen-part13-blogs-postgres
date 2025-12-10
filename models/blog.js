const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.TEXT,
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				isUrl: { msg: 'Must be a valid URL [http://domain.tld/...]' },
			},
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		likes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: { args: [1991], msg: 'Too early. Year must not be before 1991.' },
				max: {
					args: [new Date().getFullYear()],
					msg: 'Year must be before current year.',
				},
			},
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: true,
		modelName: 'blog',
	}
)
module.exports = Blog
