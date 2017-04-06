const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }
    console.log('Connected to MongoDB...');

    var todosCollection = db.collection('Todos');
    var usersCollection = db.collection('Users');

    //*** findOneAndUpdate
    // 1st arg - Filter
    // 2nd arg - Vaule tp be updated
    // 3rd arg - Options 
    todosCollection.findOneAndUpdate({
        _id: new ObjectID('58e4568b8ed61112cb40405a')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to update Todos', err);
    });
    
    usersCollection.findOneAndUpdate({
        _id: new ObjectID('58e41b091ffb5636f81294df')
    }, {
        $set: {
            name: 'Dana'
        },
        $inc :{
            age: 5
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to update Todos', err);
    });

    db.close();
});