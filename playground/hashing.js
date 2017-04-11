const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// *** Hashing using JWT - json web token ***
var data = {
    id: 40
};

var token = jwt.sign(data, 'secretforsalting');
console.log('encoded value: ', token);

var decodedValue = jwt.verify(token, 'secretforsalting');
console.log('decoded value: ', decodedValue);

// *** Hashing using cryptojs ***
var message = 'Im Batman!';
var hash = SHA256(message).toString();

console.log(`${message} is ${hash}`);

var data = {
    id: 40
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'secretforsalting').toString()
}

// token.data.id = 50;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'secretforsalting').toString();

if (resultHash === token.hash) {
    console.log('data not changed');
} else {
    console.log('data changed');
}