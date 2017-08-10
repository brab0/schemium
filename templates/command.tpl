/*
*  The main method is where you'll put your command's logic. 
*  Of course it can has any name, since the 'entry point' is
*  specified in the main field at the command schema.
*/

function main(options) {
    console.log(options)
}

// our command's schema
require('schemium-api').command({
    <fields>
});