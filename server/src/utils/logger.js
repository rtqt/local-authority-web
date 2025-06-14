
const morgan = require('morgan');

const logger = morgan('combined', {
  skip: (req, res) => {
    return req.url === '/api/health' && res.statusCode < 400;
  }
});

module.exports = logger;
