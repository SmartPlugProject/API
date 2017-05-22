const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const router = require('./router');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.static(__dirname + '/doc'));

app.listen(config.port);
console.log('Running on port ' + config.port);

router(app, io);
