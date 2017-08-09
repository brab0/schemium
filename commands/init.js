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
var remoteOriginUrl = require('remote-origin-url');
var defaultFolder = cwd + '/';
var defaultName = "";

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
    keywords : [],
    author : "",
    license: "ISC",
    repository: {
        type: "git",
        url: ""
    },
    homepage: "",
    bugs: {
        url: ""
    }    
};

defaults.bin[defaultName] = defaults.main;

function main() {
    prompt()        
}

function prompt() {
    const readline = require('readline');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });        

    console.log("This utility will walk you through creating a package.json file.");
    console.log("It only covers the most common items, and tries to guess sensible defaults.");
    console.log("");
    console.log("Press ^C at any time to quit.");
    console.log("");

    rl.question(`root path: (${defaultFolder}) `, folder => {        

        folder = folder.trim().split(" ").join("-").toLowerCase()

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
            defaults.main = './bin/' + defaultName + '.js';
        }

        rl.question(`package name: (${defaults.name}) `, name => {
            
            defaults.name = name || defaults.name;

            rl.question(`version: (${defaults.version}) `, version => {
                
                defaults.version = version || defaults.version;
                
                rl.question(`description: `, description => {
                                    
                    defaults.description = description;
                    
                    rl.question(`bin: (${defaultName}) `, bin => {
                        defaults.bin = bin || defaults.bin;

                        rl.question(`git repository: `, repo => {
                            
                            // defaults.repo = repo;

                            rl.question(`keywords: `, keywords => {
                                
                                defaults.keywords = keywords.split(' ');

                                rl.question(`author: `, author => {
                                    
                                    defaults.author = author;                                

                                    let pkg = `${defaultFolder}/package.json`;

                                    pkg = pkg.replace('//','/', 'g')

                                    console.log(`About to write to ${pkg}`)
                                    console.log(JSON.stringify(defaults, null, 4))

                                    rl.question(`Is this ok? (yes)  `, confirm => {                                        

                                        if(confirm === "" || confirm === "y" || confirm === "yes"){
                                            writePkgJson(pkg, JSON.stringify(defaults, null, 4), function(err) {
                                                if(err) return console.log(err);

                                                console.log("Your project is ready!");

                                                rl.close();
                                            });
                                        } else {
                                            console.log("Aborted!");

                                            rl.close();
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

    rl.on('close', () => {
        console.log();
        process.exit(0);        
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
