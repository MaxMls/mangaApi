module.exports = (sequelize, DataTypes) => {
	const history = sequelize.define('history', {
		pageNum: {allowNull: true, type: DataTypes.INTEGER}
	}, {});
	history.associate = function (models) {


	};
	return history;
};
