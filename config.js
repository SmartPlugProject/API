module.exports = {
  'database': 'mongodb://smartplug:smartplug@smartplug-shard-00-00-qxtew.mongodb.net:27017,smartplug-shard-00-01-qxtew.mongodb.net:27017,smartplug-shard-00-02-qxtew.mongodb.net:27017/smartplug?ssl=true&replicaSet=SmartPlug-shard-0&authSource=admin',
  //'database': 'mongodb://localhost:27017/sensors',
  'port': process.env.PORT || 3000,
  'devices': ['microondas']
};
