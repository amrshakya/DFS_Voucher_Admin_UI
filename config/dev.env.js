const _ = require('lodash');
const prodEnv = require('./prod.env')

module.exports = _.merge({}, prodEnv, {
  "API": "https://devapi.lfcoinbdt.com/admin",
  "APP_NAME": "DFSVoucher"
})
