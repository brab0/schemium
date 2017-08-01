const cli = require('./cli');

cli.config({
    process : "schemium",
    default: "help",
    commands : "commands"
})

cli.exec();