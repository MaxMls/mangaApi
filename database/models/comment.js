module.exports = (sequelize, DataTypes) => {
	const comment = sequelize.define('comment', {
		chapterId: {allowNull: false, type: DataTypes.INTEGER},
		text:  {allowNull: true, type: DataTypes.TEXT},
		isSpoiler: {allowNull: false, type: DataTypes.BOOLEAN/*, defaultValue: false*/}
	}, {});
	comment.associate = function (models) {

		comment.hasMany(models.comment, {
			foreignKey:"parentComment",
			as: 'childComments',
			onDelete: 'CASCADE',
		});

		comment.belongsTo(models.user);
		comment.belongsTo(models.chapter);
		comment.belongsTo(models.comment, {foreignKey:"parentComment"});

	};
	return comment;
};
