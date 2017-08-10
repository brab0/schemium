/*
*  The main method is where you'll put your command's logic. 
*  Of course it can has any name, since the 'entry point' is
*  specified in the main field at the command schema.
*/

function main(options) {
    if(options.hello){
        console.log("Your CLI says Hello!");
    } else if(options.goodbye){
        console.log("Your CLI says Goodbye!");
    }
}

// our command's schema
require('schemium-api').command({
    name: 'print',
    abbrev: 'p',
    main : main,
    description : "prints a greeting message",
    options :[{
        name : "hello",
        abbrev : "hl",
        type: Boolean,
        description: "tells to program printing hello"
    }, {
        name : "goodbye",
        abbrev : "bye",
        type: Boolean,
        description: "tells to program printing goodbye"
    }]
});