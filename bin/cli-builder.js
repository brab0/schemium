#!/usr/bin/env node

const api = require('../api');

/* 
*  needs to be exported before exec() runs. So when commands require 
*  call this file again, they will know the function command()
*/

module.exports = {
    command : api.command,
    config : api.config
}

api.exec();