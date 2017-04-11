const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 4,
        trim: true,
        unique: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: '{VALUE} is not a valid email'
        }
    },
    password : {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//Overriding Mongoose's toJSON instance method so that it only return
//the properties we want instead of all the properties.
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//Create a custom instance method to generate access and token
//while creating a new user.
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'secretvalue').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    });

};

//Create a custom model method for fetching user based on token
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'secretvalue');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });

        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

var User = mongoose.model('Users', UserSchema);

module.exports = {
    User
};