/*
*  The main method is where you'll put your command's logic. 
*  Of course it can has any name, since the 'entry point' is
*  specified in the main field at the command schema.
*/

var util = require('../util');
var fs = require('fs');
var path = require('path');

function add(cb){
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });            

    promptCommand(rl, () => {
        cb();
    })
}

function promptCommand(rl, cb){
    let strCmd = "";

    rl.question(`name: `, name => {        

        if(!name){
            console.log('name is required!')
            promptCommand(rl)
        }

        strCmd += `name: '${name.toLowerCase()}',\n`;        
        
        rl.question(`abbrev: (${name.substr(0,1).toLowerCase()}) `, abbrev => {            
            strCmd += abbrev ? `\tabbrev: '${abbrev}',\n` : `\tabbrev: '${name.substr(0,1).toLowerCase()}',\n`;
            
            strCmd += `\tmain: main,\n`;

            rl.question(`description: `, description => {
                strCmd += `\tdescription: '${description}'`;

                rl.question(`Do you wanna add an option? (yes) `, confirm => {
                    if(confirm === "" || confirm === "y" || confirm === "yes"){
                        strCmd += `,\n\toptions:[`;
                        promptOptions(rl, opts => {
                            strCmd += `${opts}]`;

                            writeTemplate(strCmd, () => {
                                console.log('New command created!')
                                rl.close();
                                cb();
                            });
                        })
                    } else {                      
                        writeTemplate(strCmd, () => {
                            console.log('New command created!')
                            cb()
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

        strOpt += `\t\tname: '${name.toLowerCase()}',\n`;        
        
        rl.question(`abbrev: (${name.substr(0,1).toLowerCase()}) `, abbrev => {            
            strOpt += abbrev ? `\t\tabbrev: '${abbrev}',\n` : `\t\tabbrev: '${name.substr(0,1).toLowerCase()}',\n`;
            
            rl.question(`type: `, type => {
                strOpt += type ? `\t\ttype: ${type},\n` : "\t\ttype: Boolean,\n";

                rl.question(`description: `, description => {
                    strOpt += `\t\tdescription: '${description}'\n\t}`;
                    
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
        
        util.writeAnyway(path.resolve(process.cwd(), 'commands/test.js'), cmdTpl.toString().replace('<fields>', strCmd), function(err) {
            if(err) return console.log(err);                                                    

            cb();
        });
    });
}

module.exports = {
    add : add
}