const express = require('express');
const Sensor = require('./model/sensor');

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

    if (!name) {
      return res.status(422).json({
        success: false,
        message: 'You must send the sensor name'
      });
    }

    const sensor = new Sensor({
      name: name
    });

    sensor.save(function(err, sensor) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Sensor created successfully",
          sensor: sensor
        });
        res.end();
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
      timestamp: Date()
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

  app.use('/', routes);
  app.use('/sensor', sensorRoutes);
}
