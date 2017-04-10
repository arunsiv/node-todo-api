const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');

var id = '58e5aa4a1a36a117e033cdf';

if (!ObjectID.isValid(id)) {
    console.log('id is not valid');
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
    if (!todo){
        return console.log('id not found');
    }
    console.log('Todo by id', todo);
}).catch((e) => console.log(e));