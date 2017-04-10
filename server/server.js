var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());

//Routes

//Create todos
app.post('/todos', (req, res) => {
    var todo = new Todo({
        todo: req.body.todo
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

//Get all todos
app.get('/todos', (req, res) => {
    //get all todos
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

//Get todo based on id
app.get('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

module.exports = {
    app
};