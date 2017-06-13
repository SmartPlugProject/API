const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const router = require('./router');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.static(__dirname + '/doc'));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next()
});

const server = app.listen(config.port, () => console.log('Running on port ' + config.port ));
const wss = new SocketServer({server: server});

router(app, wss);
wss.on('connection', (ws) => {
  console.log('Client connected');

});

wss.on('disconnect', () => console.log('Client disconnected'));
