module.exports = {
  //'database': 'mongodb://smartplug:smartplug@ds119091.mlab.com:19091/smartplug',
  'database': 'mongodb://localhost:27017/sensors',
  'port': process.env.PORT || 3000,
  'devices': ['microondas']
};
