/*
*  The main method is where you'll put your command's logic. 
*  Of course it can has any name, since the 'entry point' is
*  specified in the main field at the command schema.
*/

var util = require('../util');
var fs = require('fs');
var path = require('path');

function main(options) {
    add()
}

function add(){
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });            

    promptCommand(rl)

    rl.on('close', () => {
        console.log();
        process.exit(0);        
    });
}

function promptCommand(rl){
    let strCmd = "";

    rl.question(`name: `, name => {        

        if(!name){
            console.log('name is required!')
            promptCommand(rl)
        }

        strCmd += `name: '${name.toLowerCase()}',\n`;        
        
        rl.question(`abbrev: (${name.substr(0,1).toLowerCase()}) `, abbrev => {            
            strCmd += abbrev ? `abbrev: '${abbrev}',\n` : `abbrev: '${name.substr(0,1).toLowerCase()}',\n`;
            
            strCmd += `main: main,\n`;

            rl.question(`description: `, description => {
                strCmd += `description: '${description}'`;

                rl.question(`Do you wanna add an option? (yes) `, confirm => {
                    if(confirm === "" || confirm === "y" || confirm === "yes"){
                        strCmd += `,\noptions:[`;
                        promptOptions(rl, opts => {
                            strCmd += `${opts}]`;

                            writeTemplate(strCmd, () => {
                                console.log('New command created!')
                                rl.close()
                            });
                        })
                    } else {                      
                        writeTemplate(strCmd, () => {
                            console.log('New command created!')
                            rl.close()
                        });
                    }                    
                });
            });
        });
    });
}

function promptOptions(rl, cb, strOpt = ""){

    strOpt += "{\n";

    rl.question(`name: `, name => {        

        if(!name){
            console.log('name is required!')
            prompt(rl)
        }

        strOpt += `name: '${name.toLowerCase()}',\n`;        
        
        rl.question(`abbrev: (${name.substr(0,1).toLowerCase()}) `, abbrev => {            
            strOpt += abbrev ? `abbrev: '${abbrev}',\n` : `abbrev: '${name.substr(0,1).toLowerCase()}',\n`;
            
            rl.question(`type: `, type => {
                strOpt += type ? `type: ${type},\n` : "type: Boolean,\n";

                rl.question(`description: `, description => {
                    strOpt += `description: '${description}'\n}`;
                    
                    rl.question(`add another option? (yes) `, confirm => {
                        if(confirm === "" || confirm === "y" || confirm === "yes"){
                            promptOptions(rl, cb, strOpt+",")
                        } else {
                            cb(strOpt)
                        }
                    
                    });                    
                });
            });
        });
    });
}

function writeTemplate(strCmd, cb){
    fs.readFile(path.resolve(__dirname, '../templates/command.tpl'), function(oErr, cmdTpl) {
        if(oErr) return console.log(oErr);

        util.writeAnyway(path.resolve(__dirname, 'sample/test.js'), cmdTpl.toString().replace('<fields>', strCmd), function(err) {
            if(err) return console.log(err);                                                    

            cb();
        });
    });
}

// our command's schema
require('schemium-api').command({
    name: 'command',
    abbrev: 'c',
    main : main,
    description : "add a new command"
});