var mout = require('mout');
var nopt = require('nopt');

function readOptions(options, argv) {
    var types;
    var noptOptions;
    var parsedOptions = {};
    var shorthands = {};

    if (Array.isArray(options)) {
        argv = options;
        options = {};
    } else {
        options = options || {};
    }

    types = mout.object.map(options, function (option) {
        return option.type;
    });
    
    mout.object.forOwn(options, function (option, name) {
        shorthands[option.shorthand] = '--' + name;
    });

    noptOptions = nopt(types, shorthands, argv);

    // Filter only the specified options because nopt parses every --
    // Also make them camel case
    mout.object.forOwn(noptOptions, function (value, key) {
        if (options[key]) {
            parsedOptions[mout.string.camelCase(key)] = value;
        }
    });

    parsedOptions.argv = noptOptions.argv;

    return parsedOptions;
}

module.exports.readOptions = readOptions;