const express = require('express');
const routes = require('../routes');

const server = express();

server.use(express.json());

server.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
	next();
});


server.use(express.static('public'));

server.use('/api', routes);

module.exports = server;
