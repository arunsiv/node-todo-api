// const MongoClient = require('mongodb').MongoClient;
//ES6 Object Destructuring
const {MongoClient, ObjectID} = require('mongodb');

//Generating object ID from Mongo DB
// var obj = new ObjectID;
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }
    console.log('Connected to MongoDb server');

    db.collection('Todos').insertOne({
        todo: 'Buy Groceries',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todos', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    });

    db.collection('Users').insertOne({
        name: 'Arun',
        age: 32,
        location: 'home'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert users', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    });

    db.close();
});