const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const envConfigs = require('../config/config');


const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];
const db = {};

const sequelize = config.url ? new Sequelize(config.url, config) : new Sequelize(config.dbname, config.username, config.password, config);


fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

function isAdmin(user) {
	return user.role === 0;
}

const out = {sequelize, Sequelize, isAdmin};
Object.assign(out, sequelize.models);



(async function () {
	sequelize.options.logging = false;
	const options = {alter: true, force: false};
	await sequelize.sync(options);
	console.log("sequelize.sync", options, "end");
	sequelize.options.logging = console.log;

	const migrations = require('../migrations');
	migrations.sync();
})();







module.exports = out;
