const { DataTypes } = require('sequelize')
module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.createTable('active_sessions', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				references: { model: 'users', key: 'id' },
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		}),
			await queryInterface.addColumn('users', 'admin', {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			})

		await queryInterface.addColumn('users', 'disabled', {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		})
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.dropTable('active_sessions')
		await queryInterface.removeColumn('users', 'admin')
		await queryInterface.removeColumn('users', 'disabled')
	},
}
