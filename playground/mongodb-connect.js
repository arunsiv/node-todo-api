const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }
    console.log('Connected to MongoDB...');

    db.collection('Todos').insertOne({
        todo: 'Play Volleyball',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to Insert', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    });

    db.collection('Users').insertOne({
        name: 'John',
        age: 32,
        location: 'Galati'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to Insert', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    });

    db.close();
});