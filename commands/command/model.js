const path = require('path');
const mout = require('mout');

const config = require('../../config');
const { file, inquirer, ora, chalk } = require('schemium-api').essentials;

function prompt() {
   return inquirer.prompt({
      type: "input",
      name: "name",
      message: "name:",
      validate: function (input) {
         return input !== "" || 'name is required!'
      },
      filter: function (input) {
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
      let schema = Object.assign(res, { main: mout.string.camelCase(res.name), options: [] });

      console.log("─────────────────────────────────────────────────────────────────")
      return inquirer.prompt({
         type: "confirm",
         name: "option",
         message: `Do you wanna ${chalk.bold.green("add an option")} to this command?`
      })
      .then(res => {
         if (res.option) return addOption(schema);
         else return schema;
      })
   })
   .then(schema => parseTemplate(schema, path))
   .then(() => inquirer.prompt({
      type: "confirm",
      name: "command",
      message: `Do you wanna ${chalk.bold.green("add another command")}?`
   }))
   .then(res => {
      if (res.command) return addCommand(path);
      else return path;
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
         choices: ['Boolean', 'String', 'Number']
      })
      .then(res => Object.assign(input, res))
   })
   .then(res => {
      schema.options.push(res);

      console.log("─────────────────────────────────────────────────────────────────")
      return inquirer.prompt({
         type: "confirm",
         name: "option",
         message: `Do you wanna ${chalk.bold.green("add another option")}?`
      })
   })
   .then(res => {
      if (res.option) return addOption(schema);
      else {            
         return schema;
      }
   })
}

function parseTemplate(schema, cwd) {
   console.log('building command\'s structure...')
   
   const { schemium } = require(path.resolve(cwd, 'package.json'))
   const configPaths = {
      controller: path.resolve(cwd, schemium.path.controllers.replace(new RegExp(/\*\*/, 'g'), schema.name).replace(new RegExp(/\*/, 'g'), schema.name)),
      schema: path.resolve(cwd, schemium.path.schemas.replace(new RegExp(/\*\*/, 'g'), schema.name).replace(new RegExp(/\*/, 'g'), schema.name))
   }

   return file.read(config.paths.templates + '/schema-option.tpl')
   .then(schemaOption => {
      return schema.options.map(option => {
         return schemaOption
            .toString()
            .replace('<name>', option.name)
            .replace('<abbrev>', option.abbrev)
            .replace('<type>', option.type)
            .replace('<description>', option.description);
      })
      .join(',');
   })
   .then(parsedOptions => {
      return file.read(config.paths.templates + '/schema-command.tpl')
      .then(schemaCommand => {
         let controllerPath = path.relative(configPaths.schema, configPaths.controller).replace('../', '');

         if (!new RegExp(/..\//).test(controllerPath))
            controllerPath = './' + controllerPath;

         return schemaCommand
            .toString()
            .replace('<name>', schema.name)
            .replace('<abbrev>', schema.abbrev)
            .replace('<main>', schema.main)
            .replace('<description>', schema.description)
            .replace('<options>', parsedOptions)
            .replace('<controller-path>', controllerPath);
      })
   })   
   .then(parsedSchema => file.write({
      to: configPaths.schema, 
      content: parsedSchema
   }))
   .then(() => file.read(config.paths.templates + '/controller.tpl'))
   .then(controller => controller.toString().replace(new RegExp('<main>', 'g'), schema.main))
   .then(parsedModel => file.write({
      to: configPaths.controller, 
      content: parsedModel
   }));   
}

module.exports = {
   addCommand: addCommand,
   addOption: addOption
}