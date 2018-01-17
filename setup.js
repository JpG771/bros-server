'use strict';
// Use this file for 1st time setup of the project

var fs = require('fs');
fs.createReadStream('.sample-env')
  .pipe(fs.createWriteStream('.env'));