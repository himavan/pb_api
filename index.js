const config = require('config');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const users = require('./routes/users');
const contacts = require('./routes/contacts');
const groups = require('./routes/groups');
const auth = require('./routes/auth');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR : jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/pb', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDb...'))
    .catch(err => console.error('Could not connect to MongoDb...' + err));

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, x-auth-token, Content-Type, Accept, Authorization");

    next();
}

app.use(express.json({limit: '50mb'}));
app.use(allowCrossDomain);
app.use('/',express.static('public'));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/contacts', contacts);
app.use('/api/groups', groups);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));