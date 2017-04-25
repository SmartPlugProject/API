const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//=========================================
// Sensor Schema
//=========================================
const SensorSchema = new Schema({
  name: {
    type: String,
    lowercase: true
  },
  value: [{
    timestamp: Date,
    voltage: Number,
    current: Number
  }]
});

module.exports = mongoose.model('Sensor', SensorSchema);
