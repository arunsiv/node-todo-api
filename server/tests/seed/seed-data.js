const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

//Seed Data for Todos
const todoTestData = [{
    _id: new ObjectID,
    todo: 'Test Data 1'
}, {
    _id: new ObjectID,
    todo: 'Test Data 2',
    completed: true,
    completedAt: 123
}, {
    _id: new ObjectID,
    todo: 'Test Data 3'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todoTestData);
    }).then(() => {
        done();
    });
};

//Seed Data for Users
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const userTestData = [{
    _id: userOneId,
    email: 'test@test.com',
    password: 'Password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId,
            access: 'auth'
        }, 'secretvalue').toString()
    }]
}, {
    _id: userTwoId,
    email: 'test1@test.com',
    password: 'Password1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userTwoId,
            access: 'auth'
        }, 'secretvalue').toString()
    }]
}, {
    _id: userThreeId,
    email: 'test2@test.com',
    password: 'Password2',
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(userTestData[0]).save();
        var userTwo = new User(userTestData[1]).save();
        var userThree = new User(userTestData[2]).save();

        return Promise.all([userOne, userTwo, userThree]);

    }).then(() => {
        done();
    });
};

module.exports = {
    todoTestData,
    populateTodos,
    userTestData,
    populateUsers
};