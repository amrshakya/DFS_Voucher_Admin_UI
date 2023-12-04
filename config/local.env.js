const _ = require('lodash');
const prodEnv = require('./prod.env')

module.exports = _.merge({}, prodEnv, {
  "API": "http://localhost:7749/admin",
  "APP_NAME": "DFSVoucher"
})
