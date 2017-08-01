const cli = require('../cli');

const main = function(options, config) {
    process.stdout.write("importing...\n");
}

cli.addCommand({
    name: 'import',
    main : main,
    description : "Imports a Database schema",
    options : [{
        shorthand:   "-C",
        flag:        "--complete",
        description: "Imports with data"
    }]
});
