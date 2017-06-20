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

function sin(peak, frequency, callback) {
  var array = [];
  for (var i = 0; i < 100; i++) {
    const value = Math.round(peak*Math.sin(2*Math.PI*frequency*i/100));
    console.log(value);
    array.includes(value);

  }
  callback(array);
}

module.exports = function(app, wss) {
  const routes = express.Router();
  const sensorRoutes = express.Router();

  routes.get('/', function(req, res) {
    return res.render('./doc/index');
  });

  /**
  * @api {post} /sensor/create Create sensor
  * @apiName PostSensorCreate
  * @apigroup Sensor
  *
  * @apiParam {String} name   Unique device name
  * @apiParam {String} device Device name among ['microondas']
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "success": true
  *       "message": "Sensor created successfully"
  *     }
  *
  * @apiErrorExample Error-Response
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "success": false
  *       "message": "You must send the sensor name"
  *     }
  */
  sensorRoutes.post('/create', function(req, res) {
    const name = req.body.name;
    const device = req.body.device;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor name'
      });
    }

    if (!device) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor device'
      });
    }

    if (!contains(device, devices)) {
      return res.status(400).json({
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

  /**
  * @api {put} /sensor/saveData/:id Save sensor data values
  * @apiName PutSensorSaveData
  * @apigroup Sensor
  *
  * @apiParam {String} id        Sensor id
  * @apiParam {Number} voltage   Sensor Voltage
  * @apiParam {Number} current   Sensor Current
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "success": true
  *       "sensor": {
  *                    "_id": "5903d2eb6cd39d2f84fcb58e",
  *                    "name": "micro1",
  *                    "device": "microondas",
  *                    "__v": 0,
  *                    "value": [
  *                      {
  *                        "timestamp": "2017-04-29T00:53:25.613Z",
  *                        "current": 2,
  *                        "voltage": 127,
  *                        "_id": "5903e405f8bb660004d94e49"
  *                      }
  *                    ]
  *                  }
  *     }
  *
  * @apiErrorExample Error-Response
  *     HTTP/1.1 400 Bad Request
  *     {
  *       "success": false
  *       "message": "You must send the sensor voltage"
  *     }
  */
  sensorRoutes.put('/saveData/:id', function(req, res, next) {
    const id = req.params.id;
    const voltage = req.body.voltage;
    const current = req.body.current;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor id'
      });
    }

    if (!voltage) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor voltage'
      });
    }

    if (!current) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor current'
      });
    }

    const update = {
      voltage: voltage,
      current: current,
      timestamp: new Date().getTime()
    }

    Sensor.findByIdAndUpdate(id, {$push: {sensorData: update}}, {upsert: true}, function(err, sensor) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      } else {
        const response = {"id": sensor.id, "sensorData": update};
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(response));
        });
        return res.status(200).json({
          success: true,
          sensor: sensor
        });
      }

    });
  });

  /**
  * @api {get} /sensor/list List all sensors
  * @apiName GetSensorList
  * @apigroup Sensor
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "success": true,
  *        "sensors": [
  *          {
  *            "_id": "5903d2eb6cd39d2f84fcb58e",
  *            "name": "micro1",
  *            "device": "microondas",
  *            "__v": 0,
  *            "value": [
  *              {
  *                "timestamp": "2017-04-29T00:53:25.613Z",
  *                "current": 2,
  *                "voltage": 127,
  *                "_id": "5903e405f8bb660004d94e49"
  *              }
  *            ]
  *          },
  *          {
  *            "_id": "5903d37d7cf1150004c45e8f",
  *            "name": "micro2",
  *            "device": "microondas",
  *            "__v": 0,
  *            "value": []
  *          }
  *        ]
  *      }
  */
  sensorRoutes.get('/list', function(req, res) {
    Sensor.find({}, function(err, sensors) {
      return res.json({
        success: true,
        sensors: sensors
      });
    });
  });

  /**
  * @api {delete} /sensor/delete/:id Delete sensor
  * @apiName DeleteSensorDelete
  * @apigroup Sensor
  *
  * @apiParam {String} id        Sensor id
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "success": true,
  *        "message": "Sensor removed successfully"
  *     }
  */
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

  /**
  * @api {get} /sensor/searchById/:id Search a sensor by id
  * @apiName GetSensorSearchById
  * @apigroup Sensor
  *
  * @apiParam {String} id        Sensor id
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "success": true,
  *        "message": "Sensor removed successfully"
  *     }
  */
  sensorRoutes.get('/searchById/:id', function(req, res) {
    const id = req.params.id;
    Sensor.findById(id, function(err, sensor) {
      const name = sensor.name;
      const device = sensor.device;
      const values = sensor.value;
      return res.json({
        name,
        device,
        values
      });
    });
  });

  /**
  * @api {get} /sensor/searchByName/:name Search a sensor by id
  * @apiName GetSensorSearchById
  * @apigroup Sensor
  *
  * @apiParam {String} name        Sensor name
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "success": true,
  *        "sensor":
  *          {
  *            "_id": "5903d2eb6cd39d2f84fcb58e",
  *            "name": "micro1",
  *            "device": "microondas",
  *            "__v": 0,
  *            "value": [
  *              {
  *                "timestamp": "2017-04-29T00:53:25.613Z",
  *                "current": 2,
  *                "voltage": 127,
  *                "_id": "5903e405f8bb660004d94e49"
  *              }
  *            ]
  *          }
  *     }
  */
  sensorRoutes.get('/searchByName/:name', function(req, res) {
    const name = req.params.name;
    Sensor.findOne({name: name}, function(err, sensor) {
      return res.json({
        success: true,
        sensor: sensor
      });
    });
  });

  /**
  * @api {get} /sensor/searchByDevice/:device Search all sensors from defined device
  * @apiName GetSensorSearchByDevice
  * @apigroup Sensor
  *
  * @apiParam {String} device   Device among ['microondas']
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *        "success": true,
  *        "sensors": [
  *          {
  *            "_id": "5903d2eb6cd39d2f84fcb58e",
  *            "name": "micro1",
  *            "device": "microondas",
  *            "__v": 0,
  *            "value": [
  *              {
  *                "timestamp": "2017-04-29T00:53:25.613Z",
  *                "current": 2,
  *                "voltage": 127,
  *                "_id": "5903e405f8bb660004d94e49"
  *              }
  *            ]
  *          },
  *          {
  *            "_id": "5903d37d7cf1150004c45e8f",
  *            "name": "micro2",
  *            "device": "microondas",
  *            "__v": 0,
  *            "value": []
  *          }
  *        ]
  *      }
  */
  sensorRoutes.get('/searchByDevice/:device', function(req, res) {
    const device = req.params.device;
    Sensor.find({device: device}, function(err, sensors) {
      return res.json({
        success: true,
        sensors: sensors
      });
    });
  });

  sensorRoutes.post('/generateSinoideEnergy/:id', function(req, res) {
    const id = req.params.id;
    const voltagePeak = req.body.voltagePeak != null ? req.body.voltagePeak : 127;
    const currentPeak = req.body.currentPeak != null ? req.body.currentPeak : 2;
    const frequency = req.body.frequency != null ? req.body.frequency : 60;

    var voltages;
    sin(voltagePeak, frequency, function(voltageArray) {
      voltages = voltageArray;
      sin(currentPeak, frequency, function(currentArray) {
        console.log(voltages);
        console.log("Current Array" + currentArray);

        var update = [];
        const now = Date.now();

        for (var i = 0; i < voltagePeak.length; i++) {
          const value = {
            timestamp: now + (5 * i),
            voltage: voltages[i],
            current: currents[i]
          }
          update.includes(value);
        }

        Sensor.findByIdAndUpdate(id, {$push: {value: update}}, {upsert: true}, function(err, sensor) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message
            });
          } else {
            const response = {"id": sensor.id, "value": update};
            wss.clients.forEach((client) => {
              client.send(JSON.stringify(response));
            });
            return res.status(200).json({
              success: true,
              sensor: sensor
            });
          }

        });
      });
    });
  });

  sensorRoutes.post('/savePower/:id', function(req, res) {
    const id = req.params.id;
    const energy = req.body.energy;
    const timestamp = Date.now();

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor id'
      });
    }

    if (!energy) {
      return res.status(400).json({
        success: false,
        message: 'You must send the sensor energy'
      });
    }

    const update = {
      timestamp: timestamp,
      value: energy
    };

    Sensor.findByIdAndUpdate(id, {$push: {energy: update}}, {upsert: true}, function(err, sensor) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      } else {
        // const response = {"id": sensor.id, "value": update};
        // wss.clients.forEach((client) => {
        //   client.send(JSON.stringify(response));
        // });
        return res.status(200).json({
          success: true,
          sensor: sensor
        });
      }
    });
  });

  app.use('/', routes);
  app.use(function(req, res, next) {
    const sensorId = req.query.id || '';
    if (sensorId != '') {
      Sensor.findById(sensorId, function(err, sensor) {
        if (err) {
          console.log(err);
        } else {
          io.emit('sensor', sensor.values);
        }
        next();
      });
    } else {
      next();
    }
  });
  app.use('/sensor', sensorRoutes);
}
