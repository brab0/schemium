const controller = require('./controller');

function init(options) {   
   console.log("\nThis utility will walk you through creating a Schemium's project.");
   console.log("Press ^C at any time to quit.\n");
   
   controller.setProjectRoot(options.path)
   .then(path => controller.setPackageJson(path))
   .then(res => controller.buildProject(res))
   .then(res => {
      if (res.continue) {
         return require('../command/model').add(res.path);
      }
   })
   .catch(ex => {
      console.log(ex);
   });
}

module.exports = {
   init: init
}