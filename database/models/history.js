module.exports = (sequelize, DataTypes) => {
	const history = sequelize.define('history', {
		pageNum: {allowNull: false, type: DataTypes.INTEGER}
	}, {});
	history.associate = function (models) {


	};
	return history;
};
