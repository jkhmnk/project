 var settings = require('../settings'),
    Db = require('mongodb').Db,
    // Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

//var MongoClient = require('mongodb').MongoClient;
//var assert = require('assert');
//var url = 'mongodb://localhost:27017/blog';
//
//MongoClient.connect(url, function(err, db) {
//    assert.equal(null, err);
//    console.log("Connected correctly to server.", db);
//    db.close();
//});

 module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});