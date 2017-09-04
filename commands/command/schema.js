const controller = require('./controller');

require('schemium-api').command({
    name: 'command',
    abbrev: 'c',
    main : controller.command,
    description : "add a new command"
});