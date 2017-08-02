function main() {
    console.log("importing...");
}

require('../cli').addCommand({
    name: 'import',
    main : main,
    description : "Imports a Database schema",
    options : {
        "get-content" : {            
            type: String,
            description: "Imports with data"
        },
        "procedures" : {            
            type: Boolean,
            description: "Imports with data"
        }
    }
});
