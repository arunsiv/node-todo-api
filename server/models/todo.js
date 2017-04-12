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
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {
    Todo
};