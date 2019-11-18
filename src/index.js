// we create 'users' collection in newdb database
var url = "mongodb://localhost:27017/newdb";
// var DATABASEUSERNAME="admin";
// var DATABASEPASSWORD="admin123";
// var DATABASEHOST="localhost";
// var DATABASEPORT="27017";
// var DATABASENAME="newdb";
// var url='mongodb://'+DATABASEUSERNAME+':'+DATABASEPASSWORD+'@'+DATABASEHOST+':'+DATABASEPORT+'/'+DATABASENAME;
//this is supposed to create the new db and then 
 
// create a client to mongodb
var MongoClient = require('mongodb').MongoClient;
// var Db = require('mongodb').Db, Server = require('mongodb').Server ,
//using mongoclient that comes with the mongodb .. this can be done..


// make client connect to mongo service
MongoClient.connect(url ,function(err, client) {
    if (err) throw err;
    // db pointing to newdb
    //this is to know the database name..
    // console.log("Switched to "+db.databaseName+" database");
    var db = client.db('newdb');
    // db.auth( "admin", "admin123" )
    //this is some thing new 
    // document to be inserted
    var doc = { name: "Roshan", age: "22" };
    
    // insert document to 'users' collection using insertOne
    db.collection("users").insertOne(doc, function(err, res) {
        if (err) throw err;
        console.log("Document inserted");
        // close the connection to db when you are done with it
        // db.close();
    });
});