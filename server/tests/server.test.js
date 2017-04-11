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
    todo: 'Test Data 2',
    completed: true,
    completedAt: 123
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
    var hexId = new ObjectID(todoTestData[0]._id).toHexString();

    it('should return todo based on id', (done) => {
        request(app)
            .get(`/todos/${hexId}`)
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

describe('DELETE /todos/:id', () => {
    var hexId = new ObjectID(todoTestData[1]._id).toHexString();

    it('should delete todo based on id', (done) => {
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return 404 if todo is not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ids', (done) => {
        request(app)
            .delete('/todos/123xyz')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        var hexId = new ObjectID(todoTestData[0]._id).toHexString();
        var todoText = 'Im Batman';
 
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                todo: todoText,
                completed: true,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.todo).toBe(todoText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear compleetedAt when todo is not completed', (done) => {
        var hexId = new ObjectID(todoTestData[1]._id).toHexString();
        var todoText = 'Im Batman';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                todo: todoText,
                completed: false,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.todo).toBe(todoText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

    it('should return 404 if todo is not found', (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ids', (done) => {
        request(app)
            .patch('/todos/123xyz')
            .expect(404)
            .end(done);
    });
});