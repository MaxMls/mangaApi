module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
		name: {allowNull: false, type: DataTypes.TEXT/*, unique: true*/},
		password: {allowNull: false, type: DataTypes.TEXT},
		role: {allowNull: false, type: DataTypes.INTEGER}
	}, {});
	user.associate = function (models) {

		user.hasMany(models.comment);

		user.belongsToMany(models.title, {through: 'favorites'});
		user.belongsToMany(models.tag, {through: 'tagsBlocked'});
		user.belongsToMany(models.chapter, {through: 'history'});
	};
	return user;
};
