const model = require('./model');

function init(options) {   
   console.log("\nThis utility will walk you through creating a Schemium's project.");
   console.log("Press ^C at any time to quit.\n");
   
   model.setProjectRoot(options.path)
   .then(path => model.setPackageJson(path))
   .then(res => model.buildProject(res))
   .then(res => {
      if (res.continue) {
         return require('../command/controller').add(res.path);
      }
   })
   .catch(ex => {
      console.log(ex);
   });
}

module.exports = {
   init: init
}