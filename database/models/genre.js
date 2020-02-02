// Тег это вся инфа для структуризации
// есть теги манга, books, comics,
module.exports = (sequelize, DataTypes) => {
	const genre = sequelize.define('genre', {
		name: {allowNull: false, type: DataTypes.TEXT/*, unique: true*/}
	}, {});
	genre.associate = function (models) {

		genre.belongsToMany(models.chapter, {through: 'titlesGenres', onDelete: 'CASCADE'});

		//tag.belongsToMany(models.user, {through: 'tagBlackList', onDelete: 'CASCADE'});
	};
	return genre;
};
