// const path = require('path');
let mode = (process.env.mode) ? process.env.mode : 'prod';
mode = mode.replace(/-/g, '/');
const app = require(`./${mode}.env`);

module.exports = app;
