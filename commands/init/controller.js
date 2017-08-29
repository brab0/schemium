const path = require('path'),
      fs = require('fs'),
      remoteOriginUrl = require('remote-origin-url'),
      inquirer = require('inquirer'),
      ora = require('ora'),
      config = require('../../config');

const project = require(path.resolve(config.paths.commands, 'project/model')),
      command = require(path.resolve(config.paths.commands,'command/model'));

const { file } = require(config.paths.utils);

// const cwd = process.cwd();
// let defaultFolder = cwd + '/';
// let defaultName = "";
// let defaultBin = "";
// let pkg = `${defaultFolder}/package.json`.replace(new RegExp('//','g'),'/');


// try{
//     defaultName = cwd.split('/')[cwd.split('/').length - 1];
// } catch(ex){
//     defaultName = cwd;
// }

// let defaults = {
//     name : defaultName,
//     version : "0.0.1",
//     description : "",
//     main : "./bin/" + defaultName + '.js',
//     bin : {},
//     scripts : {
//         test: "echo \"Error: no test specified\" && exit 1"
//     },
//     repository: {
//         type: "git",
//         url: ""
//     },
//     keywords : [],
//     author : "",
//     license: "ISC",    
//     homepage: "",
//     bugs: {
//         url: ""
//     },
//     dependencies: {
//         "schemium-api": "^0.0.3"
//     },
//     schemium: {
//         path: {
//             schemas: "commands/**/schema.js",
//             models: "commands/**/model.js",
//             controllers: "commands/**/controller.js"
//         }
//     }
// };

// defaults.bin[defaultName] = defaults.main;
// let rl = {}; 

function setProjectRoot(path){    
    return new Promise(resolve => {
        if(path){
            console.log(`root path: ${path}`)
            resolve(path.trim().replace(new RegExp(' ', 'g'), '-').toLowerCase())
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
                        return path;                        
                    else{
                        return cwd + path;
                    }
                }
            })
            .then(path => resolve(path))
        }
    })
    .then(path => checkProjectRoot(path));
}

function setPackageJson(path) {    
    return setGitInfo(path)
    .then(gitInfo => {
        return inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'package name:',
            default: getProjectName(path)
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
        }])
        .then(answers => Object.assign(answers, gitInfo, {
            version : "0.0.1",
            main : "./bin/" + answers.name + '.js',
            scripts : {
                test: answers.test || "echo \"Error: no test specified\" && exit 1"
            },
            bin : {
                [answers.name] : "./bin/" + answers.name + '.js'
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
        }))
        .then(package => {
            delete package.test;

            return package;
        })
    })
    .then(package => {        
        const packageStringified = JSON.stringify(package, null, 4);

        console.log(`\nAbout to write to: ${path}`)
        console.log(packageStringified)

        return inquirer.prompt({
            type: 'confirm',
            name: 'create',
            message: 'Is this ok?',
            default: true
        })
        .then(answer => Object.assign(answer, { packageStringified: packageStringified }))
    })
    .then(res => {        
        if(res.create) {
            const spinner = ora('Creating package.json file...').start();            
            
            return file.write({
                to: path + '/package.json', 
                content: res.packageStringified
            })
            .then(() => spinner);

        } else {
            console.log("Aborted!");
            process.exit(0);
        }
    })
    .then(spinner => {
        return new Promise(resolve => {
            setTimeout(function(){
                spinner.succeed();
                resolve(path);
            }, 1000);
        });
    })
    .catch(ex => {
        console.log()
        throw new Error(ex);
    });
}

function getProjectName(path){    
    try{
        let name = path.split('/')[path.split('/').length - 1];
        
        if(name === ""){
            name = path.split('/')[path.split('/').length - 2];
        }

        return name;

    } catch(ex){                
        return path;
    }
}

function checkProjectRoot(data){    
    return new Promise((resolve, reject) => {
        fs.stat(`${data.path}/package.json`.replace('//','/', 'g'), function(err, stat) {            
            if(err == null) {
                console.log();
                console.log(`The path ${data.path} already exists and has a package.json file.\nIf you decide to continue, the existent file will be overwritten.`);
                
                inquirer.prompt({
                    type: 'confirm',
                    name: 'continue',
                    message: `Continue anyway?`,
                    default: true
                })
                .then(asw => {
                    console.log();
                    resolve(Object.assign(asw, data))
                });
            } else if(err.code == 'ENOENT') {
                resolve(Object.assign({continue: true}, data));
            } else {
                reject(err.code);                
            }
        });
    })
    .then(res => {
        if(res.continue){
            return res.path;
        } else {
            console.log("Aborted!");
            process.exit(0);
        }
    })
    .catch(ex => {
        throw new Error(ex);
    })
}

function setGitInfo(path){
    return new Promise(resolve => {
        remoteOriginUrl(`${path}.git/config`, 
        (err, url) => {
            if(url){
                url = url.split('.git').shift();
                
                resolve({
                    repository: { 
                        url: `git+${url}.git` 
                    },
                    bugs: { 
                        url: `${url}/issues`
                    },
                    homepage: `${url}#readme`
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

function buildProject(rootPath){    
    return project.add(rootPath)
    .then(() => file.writeFromTpl({
        from: path.resolve(config.paths.templates, 'templates/bin.tpl'),
        to: path.resolve(rootPath, defaults.bin[defaultBin])
    }))
    .then(res => {
        console.log("Installing Dependencies...");

        return require('child_process')
        .exec('npm install', {
            cwd : path
        }, (error, stdout, stderr) => {

            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            
            process.stdout.write(stdout)
            console.log("");                
        }); 
    })
    .then(() => inquirer.prompt({
        type: 'confirm',
        name: 'continue',
        message: `Your project is ready! Do you want to create some commands now?`,
        default: true
    }));
}

module.exports = {
    setProjectRoot: setProjectRoot,
    setPackageJson: setPackageJson,
    buildProject: buildProject
}