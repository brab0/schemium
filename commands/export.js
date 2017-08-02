function main(options) {
    console.log("exporting with: ", options);
}

require('../cli').addCommand({
    name: 'export',
    main : main,
    description : "Exports a Database schema",
    options : {
        "get-content" : {            
            type: String,
            description: "exports with data"
        },
        "procedures" : {            
            type: Boolean,
            description: "exports with data"
        }
    }
});
