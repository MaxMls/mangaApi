module.exports = (sequelize, DataTypes) => {
	const uniqueRule1 = "a title can have only one chapter with a unique number for each language";
	const chapter = sequelize.define('chapter', { // глава
		name: {allowNull: false, type: DataTypes.TEXT}, // можно редачить из интерфейса
		pagesCount: {allowNull: false, type: DataTypes.INTEGER/*, defaultValue: 0*/},
		titleId: {allowNull: false, type: DataTypes.INTEGER/*, unique: uniqueRule1*/},
		folderName: {allowNull: false, type: DataTypes.TEXT/*, unique: uniqueRule1*/} // имя папки с картинками главы
	}, {});
	chapter.associate = function (models) {
		chapter.hasMany(models.comment, {
			as: 'comments', // отношение текущего к другому
			onDelete: 'CASCADE',
		});

		chapter.belongsToMany(models.user, {through: 'history'});

		chapter.belongsTo(models.title);
		//chapter.belongsTo(models.lang);
	};
	return chapter;
};

//  sequelize migration:create --name Chapter --attributes titleId:integer,name:string,pagesCount:integer,lang:integer,postDate:date,createDate:date
