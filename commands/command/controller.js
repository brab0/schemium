const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mout = require('mout');

const { writeFile } = require('../../util');

let rl = {};

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

function promptCommand(path, cb){
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('close', () => {
        console.log()
    })

    console.log("This utility will walk you through creating a Schemium's command.");        
    console.log("Press ^C at any time to quit.");
    console.log("");

    addCommand(path, () => {
        cb();
    });
}

function addCommand(path, cb){
    rl.question(`name: `, name => {

        if(!name){
            console.log('name is required!')
            addCommand(path, cb)
        }

        command.name.value = name.replace(new RegExp(' ', 'g'), '-').toLowerCase();
        command.main.value = mout.string.camelCase(name)

        rl.question(`abbrev: (${command.name.value.substr(0,1)}) `, abbrev => {
            command.abbrev.value = abbrev || command.name.value.substr(0,1);
            
            rl.question(`main: (${command.main.value}) `, main => {
                command.main.value = main || command.main.value;
                
                rl.question(`description: `, description => {
                    command.name.value = name.toLowerCase();
                    
                    promptOptions(path, () => {
                        cb()
                    });
                });
            });
        });
    });
}

function promptOptions(path, cb){
    console.log()

    rl.question(`Do you wanna add an option? (yes) `, confirm => {
        if(confirm === "" || confirm === "y" || confirm === "yes"){            
            addOption(() => {
                parseTemplate(path, () => {

                    renderTreeView(command);
                
                    rl.question(`Do you wanna add another command? (yes) `, confirm => {
                        if(confirm === "" || confirm === "y" || confirm === "yes"){                        
                            addCommand(path, cb)
                        } else {                            
                            cb();                            
                        }
                    });
                });
            });
        } else {
            parseTemplate(path, () => {
                
                renderTreeView(command);

                rl.question(`Do you wanna add another command? (yes) `, confirm => {
                    if(confirm === "" || confirm === "y" || confirm === "yes"){                        
                        addCommand(path, cb)
                    } else {                            
                        cb();                            
                    }
                });
            });
        }                    
    });
}

function renderTreeView(command){
    console.log('New command created!')
    console.log(`|-- commands/`)
    console.log(`|-- |-- ${command.name.value}/`)
    console.log(`|-- |-- |-- model.js`)
    console.log(`|-- |-- |-- schema.js`)
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

                    console.log();
                    rl.question(`Do you wanna add another option? (yes) `, confirm => {
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

function parseTemplate(pathProj, cb){    
    const { getByPath } = require('../project/controller');
    const cwd = getByPath(pathProj || process.cwd());
    const { schemium } = require(path.resolve(cwd, 'package.json'))
    const configPaths = {
        model : path.resolve(cwd, schemium.path.models.replace(new RegExp(/\*\*/, 'g'), command.name.value).replace(new RegExp(/\*/, 'g'), command.name.value)),
        schema : path.resolve(cwd, schemium.path.schemas.replace(new RegExp(/\*\*/, 'g'), command.name.value).replace(new RegExp(/\*/, 'g'), command.name.value))
    }    

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

            let modelPath = path.relative(configPaths.schema, configPaths.model).replace('../', '');

            if(!new RegExp(/..\//).test(modelPath)) 
                modelPath = './' + modelPath;

            const parsedSchema = schemaCommand
                .toString()
                .replace(command.name.tpl, command.name.value)
                .replace(command.abbrev.tpl, command.abbrev.value)
                .replace(command.main.tpl, command.main.value)
                .replace(command.description.tpl, command.description.value)
                .replace(command.options.tpl, parsedOptions)
                .replace('<model-path>', modelPath);

            writeFile(configPaths.schema, parsedSchema, function(err) {
                if(err) return console.log(err);

                fs.readFile(path.resolve(__dirname, '../../templates/model.tpl'), function(oErr, model) {
                    if(oErr) return console.log(oErr);

                    const parsedModel = model.toString().replace(new RegExp(command.main.tpl, 'g'), command.main.value);                    

                    writeFile(configPaths.model, parsedModel, function(err) {
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