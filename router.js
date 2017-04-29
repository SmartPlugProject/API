const express = require('express');
const Sensor = require('./model/sensor');
const config = require('./config');
const devices = config.devices;

function contains(value, array) {
  if (array.indexOf(value) === -1) {
    return false;
  } else {
    return true;
  }
}

module.exports = function(app) {
  const routes = express.Router();
  const sensorRoutes = express.Router();

  //========================================
  // Home Route
  //========================================
  routes.get('/', function(req, res) {
    return res.json({
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

    if (!contains(device, devices)) {
      return res.status(422).json({
        success: false,
        message: 'You must send a valid sensor device'
      });
    }

    const sensor = new Sensor({
      name: name,
      device: device,
      value: []
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
  sensorRoutes.put('/saveData/:id', function(req, res, next) {
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

    Sensor.findByIdAndUpdate(id, {$push: {value: update}}, {upsert: true}, function(err, sensor) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }
      return res.json({
        success: true,
        sensor: req.body
      });
    });
  });

  //=====================================================
  // List sensors
  //=====================================================
  sensorRoutes.get('/list', function(req, res) {
    Sensor.find({}, function(err, sensors) {
      return res.json({
        success: true,
        sensors: sensors
      });
    });
  });

  //=====================================================
  // Remove Sensor
  //=====================================================
  sensorRoutes.delete('/delete/:id', function(req, res) {
    const id = req.params.id;
    Sensor.remove({_id: id}, function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      } else {
        return res.json({
          success: true,
          message: 'Sensor removed successfully'
        });
      }
    });
  });

  //======================================================
  // Get sensor by id
  //======================================================
  sensorRoutes.get('/searchById/:id', function(req, res) {
    const id = req.params.id;
    Sensor.findById(id, function(err, sensor) {
      return res.json({
        success: true,
        sensor: sensor
      });
    });
  });

  //======================================================
  // Get sensor by name
  //======================================================
  sensorRoutes.get('/searchByName/:name', function(req, res) {
    const name = req.params.name;
    Sensor.find({name: name}, function(err, sensors) {
      return res.json({
        success: true,
        sensors: sensors
      });
    });
  });

  //======================================================
  // Get sensor by device
  //======================================================
  sensorRoutes.get('/search/:device', function(req, res) {
    const device = req.params.device;
    Sensor.find({device: device}, function(err, sensors) {
      return res.json({
        success: true,
        sensors: sensors
      });
    });
  });

  app.use('/', routes);
  app.use('/sensor', sensorRoutes);
}
