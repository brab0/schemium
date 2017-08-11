const controller = require('./controller');
const path = require('path');
const { writeFile } = require('../../util');

function project(options) {    
    if(options.use){
        use(options.use)
    }

    if(options.list){
        list()
    }

    if(options.add){        
        add(options.add)
    }

    if(options.remove){
        remove(options.remove)
    }
}

function use(value){
    console.log(value)
}

function list(){
    var projects = require(path.resolve(__dirname, '../../projects.json'));

    controller.renderList(projects);    
}

function add(argPath, cb = null){    
    controller.isSchemiumPath(argPath, (valid, config) => {  
        
        if(!valid) return console.log(`The current path is not a valid schemium\'s project: ${config.path}`);
        
        const projectsPath = path.resolve(process.cwd(), 'projects.json');
        const projects = require(projectsPath)
        
        if(!projects.some(project => project.name === config.name && project.cli === config.cli && project.path === config.path)){
            projects.push(config);

            writeFile(projectsPath, JSON.stringify(projects, null, 4), function(err) {
                if(err) return console.log(err);

                cb && cb();
            });        
        }        
    })
}

function remove(value){
    console.log(value)
}

module.exports = {
    project : project,
    use : use,
    list : list,
    add : add,
    remove : remove
}