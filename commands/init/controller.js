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

var inquirer = require('inquirer'); 

function setProjectRoot(path){
    if(path){
        return new Promise(resolve => {
            console.log(`root path: ${path}`)
            resolve({ path : path.trim().replace(new RegExp(' ', 'g'), '-').toLowerCase() })
        })
        .then(root => checkProjectRoot(root.path));
    } else {
        const cwd = process.cwd() + '/';

        return inquirer.prompt({
            type: 'input',
            name: 'path',
            message: 'root path:',
            default: cwd,
            filter: function(asw){
                let path = asw.trim().replace(new RegExp(' ', 'g'), '-').toLowerCase();
                
                if(new RegExp('^/').test(path))
                    return path
                else{
                    return cwd + path
                }
            }
        })
        .then(root => checkProjectRoot(root.path));
    }
}

function setPackageJson(root){     
    console.log(root)
    return inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'package name:',
        default: getProjectName(root)
    }, {
        type: 'input',
        name: 'description',
        message: 'description:'
    }, {
        type: 'input',
        name: 'test',
        message: 'test command:'
    }, {
        type: 'input',
        name: 'keywords',
        message: 'keywords:',
        filter : function(asw) {
            return asw.split(' ')
        }
    }, {
        type: 'input',
        name: 'author',
        message: 'author:'
    }, {
        type: 'input',
        name: 'license',
        message: 'license:',
        default: 'ISC'
    }]);
}

function getProjectName(folder){    
    try{
        let name = folder.split('/')[folder.split('/').length - 1];
        
        if(name === ""){
            name = folder.split('/')[folder.split('/').length - 2];
        }

        return name;

    } catch(ex){                
        return folder;
    }
}

function setGit(root){    
    return new Promise(resolve => {
        remoteOriginUrl(`${root}.git/config`, (err, url) => {
            if(url){
                resolve({
                    repository: { 
                        url: `git+${url}` 
                    },
                    bugs: { 
                        url: `${url.split('.git').shift()}/issues`
                    },
                    homepage: `${url.split('.git').shift()}#readme`
                })
            } else {                
                let prompt = inquirer.prompt({
                    type: 'input',
                    name: 'git',
                    message: 'git url:'
                })
                .then(url => {
                    if(url.git){
                        return {
                            repository: { 
                                url: `git+${url.git}` 
                            },
                            bugs: { 
                                url: `${url.git.split('.git').shift()}/issues`
                            },
                            homepage: `${url.git.split('.git').shift()}#readme`
                        }
                    } else{
                        return;
                    }                    
                });

                resolve(prompt)
            }
        });
    });
}

// function resolvePrompt(folder){
//     if(folder !== ""){

//         defaults.name = getDefaultName(folder);        
//         defaultFolder += folder;
//         defaults.bin = {};
//         defaults.bin[defaultName] = './bin/' + defaultName + '.js';
//         defaultBin = defaultName;
//         defaults.main = './bin/' + defaultName + '.js';

//         pkg = `${defaultFolder}/package.json`.replace('//','/', 'g');
//     }
    
//     fs.stat(pkg, function(err, stat) {
//         if(err == null) {                
//             rl.question(`\nThe path already exists and has a package.json.\nIf you decide to move on, the existent file will be overwritten.\nContinue anyway? (yes) `, confirm => {
//                 console.log("")
//                 if(confirm === "" || confirm === "y" || confirm === "yes"){                        
//                     setGitConf(rl, () => {
//                         createPackageJson(rl)
//                     })
//                 } else {
//                     console.log("Aborted!");

//                     rl.close();
//                 }
//             });
//         } else if(err.code == 'ENOENT') {
//             setGitConf(rl, () => {
//                 createPackageJson(rl)
//             })
//         } else {
//             console.log(err.code);
//         }
//     });
// }

function checkProjectRoot(root){    
    return new Promise((resolve, reject) => {
        fs.stat(`${root}/package.json`.replace('//','/', 'g'), function(err, stat) {            
            if(err == null) {
                return inquirer.prompt({
                    type: 'confirm',
                    name: 'continue',
                    message: `The path ${root} already exists and has a package.json file.\nIf you decide to go on, the existent file will be overwritten.\nContinue anyway?`,
                    default: true
                })
                .then(asw => {
                    if(asw.continue){
                        resolve(root)
                    } else {
                        reject("Aborted!");
                    }
                });           
            } else if(err.code == 'ENOENT') {
                resolve(root);
            } else {
                reject(err.code);                
            }
        });
    })
    .catch(ex => {
        console.log(ex)
        process.exit(0)
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
                                                                        
                                                                        require('../project/model').treeView(defaultFolder, () => {
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
    setProjectRoot: setProjectRoot,
    setPackageJson: setPackageJson,
    setGit: setGit
}