const controller = require('./controller');
const { treeView } = require('../project/model');
const config = require('../../config');
const { chalk } = require(config.paths.utils);

function command() {
   add(null, () => {
      process.exit(0);
   })
}

function add(path = null, cb) {
   console.log(`\nThis utility will walk you through creating a ${chalk.bold.green("Schemium's command")}.`);
   console.log("Press ^C at any time to quit.");

   const { getByPath } = require('../project/controller');
   
   return getByPath(path || process.cwd())
   .then(path => controller.addCommand(path))
   .then(path => treeView(path, 'node_modules'));
}

module.exports = {
   command: command,
   add: add
}