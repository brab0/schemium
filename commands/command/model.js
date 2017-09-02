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

   return controller.addCommand(path)
   // .then(() => treeView(path, 'node_modules'))
   // .then(() => {
   //    cb && cb();
   // });
}

module.exports = {
   command: command,
   add: add
}