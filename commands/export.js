const cli = require('../cli');

const main = function(options, config) {
    process.stdout.write("exporting...\n");
}

cli.addCommand({
    name: 'export',
    main : main,
    description : "Exports a Database schema",
    options : [{
        shorthand:   "-C",
        flag:        "--complete",
        description: "exports with data"
    }]
});
