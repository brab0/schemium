#!/usr/bin/env node

const cli = require('./cli');

cli.config({
    process : "schemium",
    default: "help",
    commands : "/**/commands/*.js"
})

cli.exec();