const path = require('path');
const mout = require('mout');

const config = require('../../config');
const { file, inquirer, ora } = require(config.paths.utils);

// let schema = {};

function prompt() {
   return inquirer.prompt({
      type: "input",
      name: "name",
      message: "name:",
      validate: function (input) {
         return input !== "" || 'name is required!'
      },
      filter: function(input){
         return input.replace(new RegExp(' ', 'g'), '-').toLowerCase()
      }
   })
   .then(input => {
      return inquirer.prompt([{
         type: "input",
         name: "abbrev",
         message: "abbrev:",
         default: input.name.substr(0, 1)
      }, {
         type: "input",
         name: "description",
         message: "description:"
      }])
      .then(res => Object.assign(input, res))
   });
}

function addCommand(path) {
   console.log();

   return prompt()
   .then(res => {
      let schema = Object.assign(res, { main : "controller." + mout.string.camelCase(res.name), options: [] });
      
      console.log("─────────────────────────────────────────────────────────────────")
      return inquirer.prompt({
         type: "confirm",
         name: "option",
         message: "Do you wanna add an option to this command?"
      })
      .then(res => {
         if(res.option) return addOption(schema);
         else return parseTemplate(schema, path);
      })
   })   
   .then(() => inquirer.prompt({
      type: "confirm",
      name: "command",
      message: "Do you wanna add another command?"
   }))
   .then(res => {
      if(res.command) return addCommand(path);
   })
}

function addOption(schema) {
   console.log()

   return prompt()
   .then(input => {
      return inquirer.prompt({
         type: "list",
         name: "type",
         message: "type:",
         choices: ['String', 'Boolean', 'Number']
      })
      .then(res => Object.assign(input, res))
   })
   .then(res => {
      schema.options.push(res);
      
      console.log("─────────────────────────────────────────────────────────────────")
      return inquirer.prompt({
         type: "confirm",
         name: "option",
         message: "Do you wanna add another option?"
      })
   })
   .then(res => {
      if(res.option) return addOption(schema);
      else return schema;
   })
}

function parseTemplate(schema, pathProj) {
   const { getByPath } = require('../project/controller');
   const cwd = getByPath(pathProj || process.cwd());
   const { schemium } = require(path.resolve(cwd, 'package.json'))
   const configPaths = {
      model: path.resolve(cwd, schemium.path.models.replace(new RegExp(/\*\*/, 'g'), command.name.value).replace(new RegExp(/\*/, 'g'), command.name.value)),
      schema: path.resolve(cwd, schemium.path.schemas.replace(new RegExp(/\*\*/, 'g'), command.name.value).replace(new RegExp(/\*/, 'g'), command.name.value))
   }

   return file.read(config.paths.templates + '/schema-option.tpl')
   .then(schemaOption => {
      const parsedOptions = command.options.values.map(option => {
         return schemaOption
            .toString()
            .replace('<name>', schema.name)
            .replace('<abbrev>', schema.abbrev)
            .replace('<type>', schema.type)
            .replace('<description>', schema.description);
      }).join(',');

      return file.read(config.paths.templates + '/schema-option.tpl')
         .then(schemaOption => {
            const parsedOptions = command.options.values.map(option => {
               return schemaOption
                  .toString()
                  .replace('<name>', schema.name)
                  .replace('<abbrev>', schema.abbrev)
                  .replace('<type>', schema.type)
                  .replace('<description>', schema.description);
            })
            .join(',');
         })
         .then(() => file.read(config.paths.templates + '/schema-command.tpl'))
         .then(res => {
            let modelPath = path.relative(configPaths.schema, configPaths.model).replace('../', '');

            if (!new RegExp(/..\//).test(modelPath))
               modelPath = './' + modelPath;

            const parsedSchema = schemaCommand
               .toString()
               .replace('<name>', command.name.value)
               .replace('<abbrev>', command.abbrev.value)
               .replace('<main>', command.main.value)
               .replace('<description>', command.description.value)
               .replace('<options>', parsedOptions)
               .replace('<model-path>', modelPath);

            file.write(configPaths.schema, parsedSchema)
            .then(res => file.read(config.paths.templates + '/schema-command.tpl'))

                  const parsedModel = model.toString().replace(new RegExp(command.main.tpl, 'g'), command.main.value);

                  file.write(configPaths.model, parsedModel, function (err) {
                     if (err) return console.log(err);

                     cb()
                  });
               });
            });
         });
      });
   });

   return;
}

module.exports = {
   addCommand: addCommand,
   addOption: addOption
}