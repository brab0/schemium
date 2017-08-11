const model = require('./model.js')

require('schemium-api').command({
    name: 'project',
    abbrev: 'p',
    main : model.project,
    description : 'projects',
    options : [{
        name: 'use',
        abbrev: 'u',
        type : String,
        description : ''
    }, {
        name: 'list',
        abbrev: 'ls',
        type : Boolean,
        description : ''
    }, {
        name: 'add',
        abbrev: 'a',
        type : String,
        description : ''
    }, {
        name: 'remove',
        abbrev: 'rm',
        type : String,
        description : ''
    }]
});