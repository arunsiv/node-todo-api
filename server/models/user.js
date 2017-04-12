const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//Custom instance method to generate auth token
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

//Custom instance method to delete auth token for a user
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        //$pull will delete an item in an array if the value matches
        $pull: {
            tokens: {
                token
            }
        }
    });
};

//Custom model method for fetching user based on token
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

//Custom model method for fetching user based on email and password
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({
        email
    }).then((user) => {
        //return the promise reject when the user is not found
        if (!user) {
            return Promise.reject();
        }

        //If user is present, compare the password in the req, with the password in db
        //Since bcrypt does not use promise, we create a new promise and inside the promise 
        // we will compare the password.
        return new Promise((resolve,reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

//Mongoose Middleware which runs before every time a model is saved
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


var User = mongoose.model('Users', UserSchema);

module.exports = {
    User
};