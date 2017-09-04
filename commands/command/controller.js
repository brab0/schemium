const model = require('./model');
const { treeView } = require('../project/controller');
const config = require('../../config');
const { chalk } = require('schemium-api').utils;

function command() {
   add(null, () => {
      process.exit(0);
   })
}

function add(path = null, cb) {
   console.log(`\nThis utility will walk you through creating a ${chalk.bold.green("Schemium's command")}.`);
   console.log("Press ^C at any time to quit.");

   const { getByPath } = require('../project/model');
   
   return getByPath(path || process.cwd())
   .then(path => model.addCommand(path))
   .then(path => treeView(path, 'node_modules'));
}

module.exports = {
   command: command,
   add: add
}