const model = require('./model');

require('schemium-api').command({
    name: 'command',
    abbrev: 'c',
    main : model.command,
    description : "add a new command"
});