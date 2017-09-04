const controller = require('./controller');

require('schemium-api').command({
    name: 'init',
    abbrev: 'i',
    main : controller.init,
    description : "Create a new CLI project",
    options : [{
        name: 'path',
        abbrev: 'p',
        type : String,
        description : "path to create",
    }]
});
