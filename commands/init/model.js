const path = require('path'),      
      remoteOriginUrl = require('remote-origin-url'),      
      config = require('../../config');

const project = require(path.resolve(config.paths.commands, 'project/controller')),
      command = require(path.resolve(config.paths.commands, 'command/controller'));

const { file, inquirer, ora } = require('schemium-api').utils;

function setProjectRoot(path) {
   return new Promise(resolve => {
      if (path) {
         console.log(`root path: ${path}`)
         resolve(path.trim().replace(new RegExp(' ', 'g'), '-').toLowerCase())
      } else {
         const cwd = process.cwd() + '/';

         return inquirer.prompt({
            type: 'input',
            name: 'path',
            message: 'root path:',
            default: cwd,
            filter: function (asw) {
               let path = asw.trim().replace(new RegExp(' ', 'g'), '-').toLowerCase();

               if (new RegExp('^/').test(path))
                  return path;
               else {
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
   .then(gitInfo => promptPackageJson(gitInfo, path))
   .then(answers => Object.assign(answers, {
      version: "0.0.1",
      main: "./bin/" + answers.name + '.js',
      scripts: {
         test: answers.test || "echo \"Error: no test specified\" && exit 1"
      },
      bin: {
         [answers.name]: "./bin/" + answers.name + '.js'
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
      if (res.create) {
         console.log("");
         const spinner = ora('Creating package.json file...').start();

         return file.write({
            to: path + '/package.json',
            content: res.packageStringified
         })
         .then(() => {
            return {
               spinner: spinner,
               package: JSON.parse(res.packageStringified)
            }
         });

      } else {
         console.log("Aborted!");
         process.exit(0);
      }
   })
   .then(res => {
      return new Promise(resolve => {
         setTimeout(function () {
            res.spinner.succeed();

            resolve({
               path: path,
               package: res.package
            });
         }, 1000);
      });
   })
   .catch(ex => {
      console.log()
      throw new Error(ex);
   });
}

function promptPackageJson(gitInfo, path){
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
      filter: function (asw) {
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
   .then(answers => Object.assign(answers, gitInfo));
}

function getProjectName(path) {
   try {
      let name = path.split('/')[path.split('/').length - 1];

      if (name === "") {
         name = path.split('/')[path.split('/').length - 2];
      }

      return name;
   } catch (ex) {
      return path;
   }
}

function checkProjectRoot(data) {
   return new Promise((resolve, reject) => {
      file.exists(`${data.path}/package.json`.replace('//', '/', 'g'), function (err, stat) {
         if (err == null) {
            console.log(`\nThe path ${data.path} already exists and has a package.json file.\
                         \nIf you decide to continue, the existent file will be overwritten.`);

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
         } else if (err.code == 'ENOENT') {
            resolve(Object.assign({ continue: true }, data));
         } else {
            reject(err.code);
         }
      });
   })
   .then(res => {
      if (res.continue) {
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

function setGitInfo(path) {
   return new Promise(resolve => {
      remoteOriginUrl(`${path}.git/config`,
      (err, url) => {
         if (url) {
            url = url.split('.git').shift();

            resolve({
               repository: {
                  url: `git+${url}.git`
               },
               bugs: {
                  url: `${url}/issues`
               },
               homepage: `${url}#readme`
            });

         } else {
            let prompt = inquirer.prompt({
               type: 'input',
               name: 'git',
               message: 'git url:',
               validate: function (input) {
                  var pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
                  return (input && new RegExp(pattern).test(input)) || input && 'This is not a valid url.' || true
               }
            })
            .then(url => {
               if (url.git) {
                  url = url.git.split('.git').shift();

                  return {
                     repository: {
                        url: `git+${url}.git`
                     },
                     bugs: {
                        url: `${url}/issues`
                     },
                     homepage: `${url}#readme`
                  }
               }

               return;
            });

            resolve(prompt)
         }
      });
   });
}

function buildProject(res) {
   return project.add(res.path)
   .then(() => file.writeFromTpl({
      from: path.resolve(config.paths.templates, 'bin.tpl'),
      to: path.resolve(res.path, res.package.bin[Object.keys(res.package.bin)[0]])
   }))
   .then(() => installDependencies(res.path))
   .then(path => project.treeView(res.path))
   .then(path => {

      console.log('Your project is ready!');

      return inquirer.prompt({
         type: 'confirm',
         name: 'continue',
         message: `Do you want to create some commands now?`,
         default: true
      })
      .then(command => Object.assign({ path: path }, command))
   });
}

function installDependencies(path) {
   const spinner = ora('Installing dependencies...').start();

   return new Promise((resolve, reject) => {
      require('child_process')
      .exec('npm install', {
         cwd: path
      }, (error, stdout, stderr) => {
         if (error) reject(`exec error: ${error}`);

         spinner.succeed();
         console.log("");

         process.stdout.write(stdout)
         console.log("");

         resolve(path);
      });
   });
}

module.exports = {
   setProjectRoot: setProjectRoot,
   setPackageJson: setPackageJson,
   buildProject: buildProject
}