const model = require('./model.js');

require('schemium-api').command({
    name: 'test1',
    abbrev: 't',
    main : model.test1,
    description : '',
    options : [{
        name: 'op2',
        abbrev: 'o',
        type : Boolean,
        description : ''
    }]
});