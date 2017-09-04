const controller = require('./controller');
const path = require('path');
const { file, dir2tree } = require('../../utils');

function project(options) {
   if (options.use) {
      use(options.use)
   }

   if (options.list) {
      list()
   }

   if (options.add) {
      add(options.add)
   }

   if (options.remove) {
      remove(options.remove)
   }
}

function use(value) {
   console.log(value)
}

function list() {
   var projects = require(path.resolve(__dirname, '../../projects.json'));

   controller.renderList(projects);
}

function treeView(argPath, ignore) {
   return controller.isSchemiumPath(argPath)
   .then(config => dir2tree({
      root: config.path,
      label: '',
      ignore: ignore
   }))
   .then(treeRedered => console.log(treeRedered + "\n"))
   .catch(err => {
      throw new Error(err);
   })
}

function add(argPath) {
   return controller.isSchemiumPath(argPath)
   .then(config => {
      let projects = require(path.resolve(__dirname, '../../projects.json'))
      const index = projects.map(project => project.path).indexOf(config.path)

      if (index == -1) {
         projects.push(config);
      } else {
         projects[index] = config;
      }

      return projects;
   })
   .then(projects => file.write({
      to: path.resolve(__dirname, '../../projects.json'),
      content: JSON.stringify(projects, null, 4)
   }))
   .catch(err => {
      throw new Error(err);
   });
}

function remove(value) {
   console.log(value)
}

module.exports = {
   project: project,
   use: use,
   list: list,
   add: add,
   remove: remove,
   treeView: treeView
}