#!/usr/bin/env node

let commands = [];
let config = {};

function requireCommands(){
    require('../commands/export');
    require('../commands/import');
}

module.exports.config = function(config) {
    config = config;
    requireCommands();
}

module.exports.exec = function() {
    console.log(commands)
}

module.exports.addCommand = function(schema){    
    commands.push(schema);
};



    // const commands = require('./commands');
    // const version = require('./version');
    // const abbreviations = require('./util/abbreviations')(commands);

    // module.exports = {
    //     version: version,
    //     commands: commands,
    //     abbreviations: abbreviations
    // };
    // process.bin = process.title = 'schemium';

    // var mout = require('mout');

    // var schemium = require('../');
    // var version = require('../lib/version');
    // var cli = require('../lib/util/cli');

    // var command;
    // var commandFunc;

    // var options = cli.readOptions({
    //     'version': { type: Boolean, shorthand: 'v' },
    //     'help': { type: Boolean, shorthand: 'h' }
    // });

    // // Handle print of version
    // if (options.version) {
    //     process.stdout.write(version + '\n');
    //     process.exit();
    // }

    // // Get the command to execute
    // while (options.argv.remain.length) {
    //     command = options.argv.remain.join(' ');

    //     // Alias lookup
    //     if (schemium.abbreviations[command]) {
    //         command = schemium.abbreviations[command].replace(/\s/g, '.');
    //         break;
    //     }

    //     command = command.replace(/\s/g, '.');

    //     // Direct lookup
    //     if (mout.object.has(schemium.commands, command)) {
    //         break;
    //     }

    //     options.argv.remain.pop();
    // }

    // // Execute the command
    // commandFunc = command && mout.object.get(schemium.commands, command);
    // command = command && command.replace(/\./g, ' ');

    // if (!commandFunc) {
    //     logger = schemium.commands.help();
    //     command = 'help';
    // } else if (options.help) {
    //     logger = schemium.commands.help(command);
    //     command = 'help';
    // } else {
    //     logger = commandFunc(process.argv);
            
    //     if (!logger) {
    //         logger = schemium.commands.help(command);
    //         command = 'help';
    //     }
    // }