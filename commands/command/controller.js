const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mout = require('mout');

const { writeFile } = require('../../util');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let command = {
    name : {
        tpl: "<name>",
        value : ""
    },
    abbrev : {
        tpl: "<abbrev>",
        value : ""
    },
    main : {
        tpl: "<main>",
        value : ""
    },
    description : {
        tpl: "<description>",
        value : ""
    },
    options : {
        tpl: "<options>",
        values: []
    }
};

function promptCommand(cb){    
    rl.question(`name: `, name => {        

        if(!name){
            console.log('name is required!')
            promptCommand(cb)
        }

        command.name.value = name.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        command.main.value = mout.string.camelCase(name)

        rl.question(`abbrev: (${command.name.value.substr(0,1)}) `, abbrev => {
            command.abbrev.value = abbrev || command.name.value.substr(0,1);
            
            rl.question(`main: (${command.main.value}) `, main => {
                command.main.value = main || command.main.value;
                
                rl.question(`description: `, description => {
                    command.name.value = name.toLowerCase();

                    cb()
                });
            });
        });
    });
}

function promptOptions(cb){
    rl.question(`Do you wanna add an option? (yes) `, confirm => {
        if(confirm === "" || confirm === "y" || confirm === "yes"){            
            addOption(() => {
                parseTemplate(() => {
                    console.log('New command created!')
                    rl.close();
                    cb();
                });
            })
        } else {                      
            parseTemplate(() => {
                console.log('New command created!')
                rl.close();
                cb()
            });
        }                    
    });
}

function addOption(cb){

    let option = {
        name : {
            tpl: "<name>",
            value : ""
        },
        abbrev : {
            tpl: "<abbrev>",
            value : ""
        },
        type : {
            tpl: "<type>",
            value : ""
        },
        description : {
            tpl: "<description>",
            value : ""
        }
    }

    rl.question(`name: `, name => {        

        if(!name){
            console.log('name is required!')
            addOption(cb)
        }

        option.name.value = name.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        
        rl.question(`abbrev: (${option.name.value.substr(0,1)}) `, abbrev => {            
            option.abbrev.value = abbrev || option.name.value.substr(0,1);
            
            rl.question(`type: (Boolean)`, type => {
                option.type.value = type || 'Boolean';

                rl.question(`description: `, description => {
                    option.description.value = description;
                    
                    command.options.values.push(option);

                    rl.question(`add another option? (yes) `, confirm => {
                        if(confirm === "" || confirm === "y" || confirm === "yes"){                            
                            addOption(cb)
                        } else {
                            cb()
                        }
                    });                    
                });
            });
        });
    });
}

function parseTemplate(cb){
    fs.readFile(path.resolve(__dirname, '../../templates/schema-option.tpl'), function(oErr, schemaOption) {
        if(oErr) return console.log(oErr);

        const parsedOptions = command.options.values.map(option => {
            return schemaOption
                .toString()
                .replace(option.name.tpl, option.name.value)
                .replace(option.abbrev.tpl, option.abbrev.value)
                .replace(option.type.tpl, option.type.value)
                .replace(option.description.tpl, option.description.value);
        }).join(',');
        
        fs.readFile(path.resolve(__dirname, '../../templates/schema-command.tpl'), function(oErr, schemaCommand) {
            if(oErr) return console.log(oErr);

            const parsedSchema = schemaCommand
                .toString()
                .replace(command.name.tpl, command.name.value)
                .replace(command.abbrev.tpl, command.abbrev.value)
                .replace(command.main.tpl, command.main.value)
                .replace(command.description.tpl, command.description.value)
                .replace(command.options.tpl, parsedOptions);

            const fileSchema = path.resolve(process.cwd(), `commands/${command.name.value}/schema.js`);

            writeFile(fileSchema, parsedSchema, function(err) {
                if(err) return console.log(err);

                fs.readFile(path.resolve(__dirname, '../../templates/model.tpl'), function(oErr, model) {
                    if(oErr) return console.log(oErr);

                    const parsedModel = model.toString().replace(new RegExp(command.main.tpl, 'g'), command.main.value);

                    const fileModel = path.resolve(process.cwd(), `commands/${command.name.value}/model.js`);

                    writeFile(fileModel, parsedModel, function(err) {
                        if(err) return console.log(err);

                        cb()
                    });
                });                  
            });
        });
    });
}

module.exports = {
    promptCommand : promptCommand,
    promptOptions : promptOptions
}