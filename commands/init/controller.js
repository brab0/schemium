const path = require('path');
const fs = require('fs');
const remoteOriginUrl = require('remote-origin-url');

const { writeFile } = require('../../util')
const project = require('../project/model');

const cwd = process.cwd();
let defaultFolder = cwd + '/';
let defaultName = "";
let defaultBin = "";
let pkg = `${defaultFolder}/package.json`.replace(new RegExp('//','g'),'/');
let command = require('../command/model');

try{
    defaultName = cwd.split('/')[cwd.split('/').length - 1];
} catch(ex){
    defaultName = cwd;
}

let defaults = {
    name : defaultName,
    version : "0.0.1",
    description : "",
    main : "./bin/" + defaultName + '.js',
    bin : {},
    scripts : {
        test: "echo \"Error: no test specified\" && exit 1"
    },
    repository: {
        type: "git",
        url: ""
    },
    keywords : [],
    author : "",
    license: "ISC",    
    homepage: "",
    bugs: {
        url: ""
    },
    dependencies: {
        "schemium-api": "^0.0.3"
    },
    schemium: {
        path: {
            schemas: "commands/**/schema.js",
            models: "commands/**/model.js",
            controllers: "commands/**/controller.js"
        }
    }
};

defaults.bin[defaultName] = defaults.main;
let rl = {};

function prompt(path) {
    const readline = require('readline');
    
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });        

    rl.on('close', () => {
        console.log()
    })

    console.log("This utility will walk you through creating a Schemium's project.");        
    console.log("Press ^C at any time to quit.");
    console.log("");

    if(path){
        console.log(`root path: ${path}`)
        resolvePrompt(path)    
    } else {
        rl.question(`root path: (${defaultFolder}) `, folder => {
            resolvePrompt(folder)
        });
    }    
}

function resolvePrompt(folder){
    folder = folder.trim().replace(new RegExp(' ', 'g'), '-').toLowerCase()

    if(folder !== ""){
        try{
            defaultName = folder.split('/')[folder.split('/').length - 1];
            
            if(defaultName === ""){
                defaultName = folder.split('/')[folder.split('/').length - 2];
            }
        } catch(ex){                
            defaultName = folder;
        }
        
        defaults.name = defaultName;            
        defaultFolder += folder;
        defaults.bin = {};
        defaults.bin[defaultName] = './bin/' + defaultName + '.js';
        defaultBin = defaultName;
        defaults.main = './bin/' + defaultName + '.js';

        pkg = `${defaultFolder}/package.json`.replace('//','/', 'g');
    }
    
    fs.stat(pkg, function(err, stat) {
        if(err == null) {                
            rl.question(`\nThe path already exists and has a package.json.\nIf you decide to move on, the existent file will be overwritten.\nContinue anyway? (yes) `, confirm => {
                console.log("")
                if(confirm === "" || confirm === "y" || confirm === "yes"){                        
                    setGitConf(rl, () => {
                        createPackageJson(rl)
                    })
                } else {
                    console.log("Aborted!");

                    rl.close();
                }
            });
        } else if(err.code == 'ENOENT') {
            setGitConf(rl, () => {
                createPackageJson(rl)
            })
        } else {
            console.log(err.code);
        }
    });
}


function setGitConf(rl, cb){
    
    remoteOriginUrl(`${defaultFolder}.git/config`, (err, url) => {
        if(url){            
            defaults.repository.url = `git+${url}`;
            defaults.homepage = `${url.split('.git').shift()}#readme`;            
            defaults.bugs.url = `${url.split('.git').shift()}/issues`;

            cb();
        } else {
            rl.question(`git url: `, git => {
                defaults.repository.url = `git+${git}`;
                defaults.homepage = `${git}#readme`;            
                defaults.bugs.url = `${git}/issues`;

                cb();
            });
        }
    });
}

function createPackageJson(rl){
    rl.question(`package name: (${defaults.name}) `, name => {
            
        defaults.name = defaultBin = defaultName = name || defaults.name;
        defaults.bin = {};
        defaults.bin[defaultBin] = './bin/' + defaultBin + '.js';
        defaults.main = './bin/' + defaultName + '.js';

        rl.question(`bin: (${defaultBin}) `, bin => {
            
            if(bin){
                defaultBin = bin;
                defaults.bin = {};
                defaults.bin[bin] = './bin/' + defaultBin + '.js';
            }                      
                    
            rl.question(`version: (${defaults.version}) `, version => {
            
                defaults.version = version || defaults.version;
            
                rl.question(`description: `, description => {
                                
                    defaults.description = description;
                
                    rl.question(`test command: `, test => {

                        defaults.scripts.test = test || defaults.scripts.test;                           

                        rl.question(`keywords: `, keywords => {
                        
                            defaults.keywords = keywords.split(' ');

                            rl.question(`author: `, author => {
                            
                                defaults.author = author;                                

                                rl.question(`license: (${defaults.license}) `, license => {
                            
                                    defaults.license = license || defaults.license;                                                                                                                           

                                    console.log(`About to write to ${pkg}`)
                                    console.log(JSON.stringify(defaults, null, 4))

                                    rl.question(`Is this ok? (yes)  `, confirm => {                                        

                                        if(confirm === "" || confirm === "y" || confirm === "yes"){

                                            //package.json
                                            writeFile(pkg, JSON.stringify(defaults, null, 4), function(err) {
                                                if(err) return console.log(err);
                                                
                                                project.add(defaultFolder, () => {
                                                    fs.readFile(path.resolve(__dirname, '../../templates/bin.tpl'), function(oErr, binTpl) {
                                                        if(oErr) return console.log(oErr);

                                                        //./bin/file.js
                                                        writeFile(path.resolve(defaultFolder,defaults.bin[defaultBin]), binTpl, function(err) {
                                                            if(err) return console.log(err);
                                                            
                                                            console.log("Installing Dependencies...");
                                                                    
                                                            require('child_process').exec('npm install', {cwd : defaultFolder}, (error, stdout, stderr) => {
                                                                if (error) {
                                                                    console.error(`exec error: ${error}`);
                                                                    return;
                                                                }
                                                                
                                                                process.stdout.write(stdout)
                                                                console.log("");
                                                                
                                                                rl.question(`Your project is ready! Do you want to create some commands now? (yes)  `, confirm => {                                        

                                                                    if(confirm === "" || confirm === "y" || confirm === "yes"){                                                                    
                                                                        
                                                                        rl.close();

                                                                        require('../command/model').add(defaultFolder, () => {
                                                                            console.log();
                                                                            process.exit(0);
                                                                        })
                                                                    } else {
                                                                        const ignore = ['node_modules', 'util', 'package.json', 'bin', 'test', 'licence'];

                                                                        require('../project/model').treeView(defaultFolder, ignore, () => {
                                                                            rl.close();
                                                                            console.log();
                                                                            process.exit(0);                                                                            
                                                                        })
                                                                    }
                                                                }); 
                                                            }); 
                                                        });
                                                    });
                                                })                                                
                                            });
                                        } else {
                                            console.log("Aborted!");

                                            rl.close();
                                            console.log();
                                            process.exit(0);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    prompt : prompt
}