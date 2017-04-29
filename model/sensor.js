const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');
const devices = config.devices;

//=========================================
// Sensor Schema
//=========================================
const SensorSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true
  },
  device: {
    type: String,
    enum: devices
  },
  value: [{
    timestamp: Date,
    voltage: Number,
    current: Number
  }]
});

module.exports = mongoose.model('Sensor', SensorSchema);
