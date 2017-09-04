const controller = require('<controller-path>');

require('schemium-api').command({
    name: '<name>',
    abbrev: '<abbrev>',
    main : controller.<main>,
    description : '<description>',
    options : [<options>]
});