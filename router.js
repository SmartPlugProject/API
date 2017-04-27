const express = require('express');
const Sensor = require('./model/sensor');
const config = require('./config');
const devices = config.devices;

module.exports = function(app) {
  const routes = express.Router();
  const sensorRoutes = express.Router();

  //========================================
  // Home Route
  //========================================
  routes.get('/', function(req, res) {
    res.json({
      message: 'success'
    });
  });

  //========================================
  // Create Sensor
  //========================================
  sensorRoutes.post('/create', function(req, res) {
    const name = req.body.name;
    const device = req.body.device;

    if (!name) {
      return res.status(422).json({
        success: false,
        message: 'You must send the sensor name'
      });
    }

    if (!device) {
      return res.status(422).json({
        success: false,
        message: 'You must send the sensor device'
      });
    }

    if (devices.include(device)) {
      return res.status(422).json({
        success: false,
        message: 'You must send a valid sensor device'
      });
    }

    const sensor = new Sensor({
      name: name,
      device: device
    });

    sensor.save(function(err) {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: "Sensor created successfully",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }
    });
  });

  //========================================
  // Update sensors data
  //========================================
  sensorRoutes.put('/save_data/:id', function(req, res, next) {
    const id = req.params.id;
    const voltage = req.body.voltage;
    const current = req.body.current;

    if (!id) {
      return res.status(422).json({
        success: false,
        message: 'You must send the sensor id'
      });
    }

    if (!voltage) {
      return res.status(422).json({
        success: false,
        message: 'You must send the sensor voltage'
      });
    }

    if (!current) {
      return res.status(422).json({
        success: false,
        message: 'You must send the sensor current'
      });
    }

    const update = {
      voltage: voltage,
      current: current,
      timestamp: Date.now()
    }

    Sensor.findOneAndUpdate({_id: id}, {value: update}, function(err, sensor) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }
      res.json({
        success: true,
        sensor: req.body
      });
    });
  });

  //=====================================================
  // List sensors
  //=====================================================
  sensorRoutes.get('/list', function(req, res) {
    Sensor.find({}, function(sensors) {
      return res.json({
        success: true,
        sensors: sensors
      });
    });
  });

  app.use('/', routes);
  app.use('/sensor', sensorRoutes);
}
