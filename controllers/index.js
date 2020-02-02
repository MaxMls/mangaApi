const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

//const re = require('./tag.js');


fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const a = require(path.join(__dirname, file))
		Object.assign(module.exports, a)

	});


//console.log(module.exports)


