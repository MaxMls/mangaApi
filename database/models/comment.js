module.exports = (sequelize, DataTypes) => {
	const comment = sequelize.define('comment', {
		titleId: {allowNull: false, type: DataTypes.INTEGER},
		authorId: {allowNull: false, type: DataTypes.INTEGER},
		text:  {allowNull: false, type: DataTypes.TEXT},
		parentCommentId:  {allowNull: true, type: DataTypes.INTEGER},
		isSpoiler: {allowNull: true, type: DataTypes.BOOLEAN},
		likeCount: {allowNull: false, type: DataTypes.INTEGER}
	}, {});
	comment.associate = function (models) {

		comment.hasMany(models.comment, {
			foreignKey:"parentCommentId",
			as: 'childComments',
			onDelete: 'CASCADE',
		});

		comment.belongsToMany(models.user, {as: 'liker', through: 'likes'});

		comment.belongsTo(models.user, { as: 'author'});
		comment.belongsTo(models.title);
		comment.belongsTo(models.comment, {foreignKey:"parentCommentId"});

	};
	return comment;
};
