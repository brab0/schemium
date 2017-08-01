function main(options) {
    console.log("exporting with: " + options);
}

require('../cli').addCommand({
    name: 'export',
    main : main,
    description : "Exports a Database schema",
    options : {
        "get-content" : {
            shorthand: "-C",
            type: String,
            description: "exports with data"
        },
        "complete" : {
            shorthand: "-C",
            type: Boolean,
            description: "exports with data"
        }
    }
});
