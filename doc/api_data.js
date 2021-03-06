define({ "api": [
  {
    "type": "delete",
    "url": "/sensor/delete/:id",
    "title": "Delete sensor",
    "name": "DeleteSensorDelete",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Sensor id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"success\": true,\n   \"message\": \"Sensor removed successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "get",
    "url": "/sensor/list",
    "title": "List all sensors",
    "name": "GetSensorList",
    "group": "Sensor",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"success\": true,\n   \"sensors\": [\n     {\n       \"_id\": \"5903d2eb6cd39d2f84fcb58e\",\n       \"name\": \"micro1\",\n       \"device\": \"microondas\",\n       \"__v\": 0,\n       \"value\": [\n         {\n           \"timestamp\": \"2017-04-29T00:53:25.613Z\",\n           \"current\": 2,\n           \"voltage\": 127,\n           \"_id\": \"5903e405f8bb660004d94e49\"\n         }\n       ]\n     },\n     {\n       \"_id\": \"5903d37d7cf1150004c45e8f\",\n       \"name\": \"micro2\",\n       \"device\": \"microondas\",\n       \"__v\": 0,\n       \"value\": []\n     }\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "get",
    "url": "/sensor/searchByDevice/:device",
    "title": "Search all sensors from defined device",
    "name": "GetSensorSearchByDevice",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device",
            "description": "<p>Device among ['microondas']</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"success\": true,\n   \"sensors\": [\n     {\n       \"_id\": \"5903d2eb6cd39d2f84fcb58e\",\n       \"name\": \"micro1\",\n       \"device\": \"microondas\",\n       \"__v\": 0,\n       \"value\": [\n         {\n           \"timestamp\": \"2017-04-29T00:53:25.613Z\",\n           \"current\": 2,\n           \"voltage\": 127,\n           \"_id\": \"5903e405f8bb660004d94e49\"\n         }\n       ]\n     },\n     {\n       \"_id\": \"5903d37d7cf1150004c45e8f\",\n       \"name\": \"micro2\",\n       \"device\": \"microondas\",\n       \"__v\": 0,\n       \"value\": []\n     }\n   ]\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "get",
    "url": "/sensor/searchById/:id",
    "title": "Search a sensor by id",
    "name": "GetSensorSearchById",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Sensor id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"success\": true,\n   \"message\": \"Sensor removed successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "get",
    "url": "/sensor/searchByName/:name",
    "title": "Search a sensor by id",
    "name": "GetSensorSearchById",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Sensor name</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"success\": true,\n   \"sensor\":\n     {\n       \"_id\": \"5903d2eb6cd39d2f84fcb58e\",\n       \"name\": \"micro1\",\n       \"device\": \"microondas\",\n       \"__v\": 0,\n       \"value\": [\n         {\n           \"timestamp\": \"2017-04-29T00:53:25.613Z\",\n           \"current\": 2,\n           \"voltage\": 127,\n           \"_id\": \"5903e405f8bb660004d94e49\"\n         }\n       ]\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "post",
    "url": "/sensor/create",
    "title": "Create sensor",
    "name": "PostSensorCreate",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Unique device name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device",
            "description": "<p>Device name among ['microondas']</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n  \"message\": \"Sensor created successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false\n  \"message\": \"You must send the sensor name\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  },
  {
    "type": "put",
    "url": "/sensor/saveData/:id",
    "title": "Save sensor data values",
    "name": "PutSensorSaveData",
    "group": "Sensor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Sensor id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "voltage",
            "description": "<p>Sensor Voltage</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "current",
            "description": "<p>Sensor Current</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n  \"sensor\": {\n               \"_id\": \"5903d2eb6cd39d2f84fcb58e\",\n               \"name\": \"micro1\",\n               \"device\": \"microondas\",\n               \"__v\": 0,\n               \"value\": [\n                 {\n                   \"timestamp\": \"2017-04-29T00:53:25.613Z\",\n                   \"current\": 2,\n                   \"voltage\": 127,\n                   \"_id\": \"5903e405f8bb660004d94e49\"\n                 }\n               ]\n             }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false\n  \"message\": \"You must send the sensor voltage\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./router.js",
    "groupTitle": "Sensor"
  }
] });
