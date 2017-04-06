const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }
    console.log('Connected to MongoDB...');

    var todosCollection = db.collection('Todos');
    var usersCollection = db.collection('Users');

    //***deleteMany
    todosCollection.deleteMany({
        todo: 'eat snack'
    }).then((result) => {
        console.log(`Delete Status: ${result.result.ok}; No. of docs deleted: ${result.result.n}`);
    }, (err) => {
        console.log('Unable to delete Todos', err);
    });

    //***deleteOne
    todosCollection.deleteOne({
        todo: 'eat breakfast'
    }).then((result) => {
        console.log(`Delete Status: ${result.result.ok}; No. of docs deleted: ${result.result.n}`);
    }, (err) => {
        console.log('Unable to delete Todos', err);
    });

    //***findOneAndDelete
    todosCollection.findOneAndDelete({
        completed: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete Todos', err);
    });

    //***Closing DB Connection
    db.close();
});