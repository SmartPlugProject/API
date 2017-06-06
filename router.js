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
      timestamp: Date.now()
    }

    Sensor.findByIdAndUpdate(id, {$push: {value: update}}, {upsert: true}, function(err, sensor) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      } else {
<<<<<<< HEAD
        const response = {"id": sensor.id, "value": update}
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(response));
=======
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(sensor));
>>>>>>> 3444d987a8b407d50c9e4bacf4ba71d362f6745f
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
      return res.json({
        sensor: sensor
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
