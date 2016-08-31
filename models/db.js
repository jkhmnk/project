var settings = require('../settings'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

console.log('asdfasdf', Connection)

module.exports = new Db(settings.db, new Server(settings.host,Connection.DEFAULT_PORT),{safe:true});