function main() {
    console.log("importing...");
}

require('../cli').addCommand({
    name: 'import',
    main : main,
    description : "Imports a Database schema",
    options : [{
        shorthand:   "-C",
        flag:        "--complete",
        description: "Imports with data"
    }]
});
