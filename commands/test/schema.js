const model = require('./model.js');

require('schemium-api').command({
    name: 'test',
    abbrev: 't',
    main : model.test,
    description : '',
    options : []
});