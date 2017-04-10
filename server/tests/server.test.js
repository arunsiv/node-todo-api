const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//Test Data
const todoTestData = [{
    _id: new ObjectID,
    todo: 'Test Data 1'
}, {
    _id: new ObjectID,
    todo: 'Test Data 2'
}, {
    _id: new ObjectID,
    todo: 'Test Data 3'
}];

//Runs before every test case
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todoTestData);
    }).then(() => {
        done();
    });
});

describe('POST /todos', () => {
    
    it('should create a new todo', (done) => {
        var todo = 'test todo text';

        request(app)
            .post('/todos')
            .send({
                todo
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toBe(todo);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    todo
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].todo).toBe(todo);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });

});

describe('GET /todos/:id', () => {

    it('should return todo based on id', (done) => {
        request(app)
            .get(`/todos/${todoTestData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.todo).toBe(todoTestData[0].todo);
            })
            .end(done);
    });

    it('should return 404 if todo is not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ids', (done) => {
        request(app)
            .get('/todos/123xyz')
            .expect(404)
            .end(done);
    });

});