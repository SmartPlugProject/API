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

const server = app.listen(config.port, () => console.log('Running on port ' + config.port ));
const wss = new SocketServer({server});

router(app, wss);
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('disconnect', () => console.log('Client disconnected'));
});
