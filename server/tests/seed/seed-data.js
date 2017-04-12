const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

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
        }, process.env.JWT_SECRET).toString()
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
        }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userThreeId,
    email: 'test2@test.com',
    password: 'Password2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userThreeId,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}];

//Seed Data for Todos
const todoTestData = [{
    _id: new ObjectID,
    todo: 'Test Data 1',
    _creator: userOneId
}, {
    _id: new ObjectID,
    todo: 'Test Data 2',
    completed: true,
    completedAt: 123,
    _creator: userTwoId
}, {
    _id: new ObjectID,
    todo: 'Test Data 3',
    _creator: userThreeId
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

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todoTestData);
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