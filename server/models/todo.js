var mongoose = require('mongoose');

var Todo = mongoose.model('Todos', {
    todo: {
        type: String,
        required: true,
        minLength: 4,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
};