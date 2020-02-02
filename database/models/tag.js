// Тег это вся инфа для структуризации
// есть теги манга, books, comics,
module.exports = (sequelize, DataTypes) => {
	const tag = sequelize.define('tag', {
		name: {allowNull: false, type: DataTypes.TEXT/*, unique: true*/}
	}, {});
	tag.associate = function (models) {

		tag.belongsToMany(models.chapter, {through: 'titlesTags', onDelete: 'CASCADE'});

		tag.belongsToMany(models.user, {through: 'tagsBlocked', onDelete: 'CASCADE'});
		//
	};
	return tag;
};
