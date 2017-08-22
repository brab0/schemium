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

function treeView(argPath, ignore, cb){
    const { dir2tree } = require('../../util');
    
    controller.isSchemiumPath(argPath, (valid, config) => {          
        if(!valid) return console.log(`The current path is not a valid schemium\'s project: ${config.path}`);
        
        const projectsPath = path.resolve(__dirname, '../../projects.json');
        const projects = require(projectsPath)

        if(projects.some(project => project.path == config.path)){
            let opts = {
                root: config.path,
                label: '',
                ignore: ignore
            };

            dir2tree(opts, (er, tr) => {                
                if (er) {
                    console.error(er);
                } else {
                    console.log(tr);
                    cb && cb();                    
                }
            });            
        } else {            
            if(!valid) return console.log(`The current path is not a valid schemium\'s project: ${config.path}`);
        }
    });
}

function add(argPath, cb = null){    
    controller.isSchemiumPath(argPath, (valid, config) => {  
        
        if(!valid) return console.log(`The current path is not a valid schemium\'s project: ${config.path}`);
        
        const projectsPath = path.resolve(__dirname, '../../projects.json');
        const projects = require(projectsPath)

        let index = projects.map(project => project.path).indexOf(config.path)

        if(index == -1){
            projects.push(config);

            writeFile(projectsPath, JSON.stringify(projects, null, 4), function(err) {
                if(err) return console.log(err);

                cb && cb();
            });        
        } else {
            projects[index] = config;

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
    remove : remove,
    treeView : treeView
}