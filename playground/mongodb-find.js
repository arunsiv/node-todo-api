const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }
    console.log('Connected to MongoDB...');

    //*** find
    db.collection('Todos').find({
        _id: new ObjectID('58e50654d2786527f8d75e08')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    //*** get count
    db.collection('Todos').count().then((docs) => {
        console.log(`Todos Count: ${docs}`);
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    db.collection('Users').find({
        age: 32
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    db.close();
});