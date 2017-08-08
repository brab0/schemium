// This utility will walk you through creating a package.json file.
// It only covers the most common items, and tries to guess sensible defaults.

// See `npm help json` for definitive documentation on these fields
// and exactly what they do.

// Use `npm install <pkg>` afterwards to install a package and
// save it as a dependency in the package.json file.

// Press ^C at any time to quit.
// package name: (projects)
// version: (1.0.0)
// description:
// entry point: (index.js)
// test command:
// git repository: https://github.com/brab0/cli-builder-api
// keywords:
// author:
// license: (ISC)
// About to write to /var/www/cli-builder/projects/package.json:

// {
//   "name": "projects",
//   "version": "1.0.0",
//   "description": "",
//   "main": "index.js",
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "repository": {
//     "type": "git",
//     "url": "git+https://github.com/brab0/cli-builder-api.git"
//   },
//   "author": "",
//   "license": "ISC",
//   "bugs": {
//     "url": "https://github.com/brab0/cli-builder-api/issues"
//   },
//   "homepage": "https://github.com/brab0/cli-builder-api#readme"
// }


// Is this ok? (yes)

const path = require('path');
const cwd = process.cwd();
var mkdirp = require('mkdirp');
var fs = require('fs');
var getDirName = require('path').dirname;

var defaultName = "";

try{
    defaultName = cwd.split('/')[cwd.split('/').length - 1];
} catch(ex){
    defaultName = cwd;
}

let defaults = {
    folder : cwd + '/',
    name : defaultName,
    version : "0.0.1",
    description : "",
    repo : "",
    keywords : [],
    author : "",
    bin : {}
};

defaults.bin[defaultName] = defaults.folder + '/bin'

function main() {
    prompt()        
}

function prompt() {
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });    

    rl.question(`root folder: (${defaults.folder}) `, folder => {

        if(folder !== ""){

            try{
                defaultName = folder.split('/')[folder.split('/').length - 1];
            } catch(ex){
                defaultName = folder;
            }
            
            defaults.name = defaultName;            
            defaults.folder += folder;
            defaults.bin = {};
            defaults.bin[defaultName] = defaults.folder + '/bin/' + defaultName + '.js'
        }

        rl.question(`package name: (${defaults.name}) `, name => {
            
            if(name !== ""){
                defaults.name = name;
            }

            rl.question(`version: (${defaults.version}) `, version => {
                
                if(version !== ""){
                    defaults.version = version;
                }

                rl.question(`description: `, description => {
                                    
                    defaults.description = description;
                    
                    rl.question(`git repository: `, repo => {
                        
                        defaults.repo = repo;

                        rl.question(`keywords: `, keywords => {
                            
                            defaults.keywords = keywords.split(' ');

                            rl.question(`author: `, author => {
                                
                                defaults.author = author;

                                rl.question(`bin: (${defaultName}) `, bin => {

                                    if(bin !== ""){
                                        defaults.bin = bin;
                                    }

                                    rl.close();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    
    rl.on('close', () => {        
        console.log(JSON.stringify(defaults, null, 4))
        writePkgJson(defaults.folder + '/package.json', JSON.stringify(defaults, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
            process.exit(0);
        });               
    });
}

function writePkgJson(path, contents, cb) {
    mkdirp(getDirName(path), function (err) {
        if (err) return cb(err);

        fs.writeFile(path, contents, cb);
    });
} 

require('cli-builder-api').command({
    name: 'init',
    abbrev: 'i',
    main : main,
    description : "Create a new CLI project"
});
