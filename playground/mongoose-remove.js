const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

var id = new ObjectID('58ebadc89c546a12f8f3a320');
Todo.findOneAndRemove({
    _id: id
}).then((todo) => {
    if (!todo){
        return console.log('Todo not found');
    }
    console.log('Todo', todo);
}).catch((e) => console.log(e));

Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){
        return console.log('id not found');
    }
    console.log('Todo', todo);
}).catch((e) => console.log(e));