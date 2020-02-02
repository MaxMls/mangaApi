module.exports = (sequelize, DataTypes) => {
	const title = sequelize.define('title', {
		name: {allowNull: false, type: DataTypes.TEXT},
		description: {allowNull: true, type: DataTypes.TEXT},
		chaptersCount: {allowNull: false, type: DataTypes.INTEGER/*, defaultValue: 0*/},
		lang: {allowNull: false, type: DataTypes.STRING(2) },
	}, {});
	title.associate = function (models) {
		// associations can be defined here
		title.hasMany(models.chapter, { onDelete: 'CASCADE'});

		// отношение многие ко многим создаст таблицу ChaptersTags куда будет складывать инфу какие теги к каким тайтлам принадлежат
		title.belongsToMany(models.tag, {through: 'titlesTags'});
		title.belongsToMany(models.genre, {through: 'titlesGenres'});

		title.belongsToMany(models.user, {through: 'favorites'});

	};
	return title;
};
