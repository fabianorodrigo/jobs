const logging = require('./logging');

module.exports.init = () => {
  // Environment
  require('dotenv').config();
  global.trace = true;
  // logging
  logging.setupLogging({ logName: 'jobs' });
  process.on('uncaughtException', err => {
    global.log.error(err);
    console.error(`Caught exception: ${err}\n`);
    console.error(err.stack);
  });
};
