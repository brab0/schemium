const model = require('./model');

require('schemium-api').command({
    name: 'init',
    abbrev: 'i',
    main : model.init,
    description : "Create a new CLI project",
    options : [{
        name: 'path',
        abbrev: 'p',
        type : String,
        description : "path to create",
    }]
});
