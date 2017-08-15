const controller = require('./controller');
const { treeView } = require('../project/model');

function command() {
    add(null,() => { 
        process.exit(0);        
    })
}

function add(path = null, cb){    
    controller.promptCommand(path, () => {
        const ignore = ['node_modules', 'util', 'package.json', 'bin', 'test', 'licence'];

        treeView(path, ignore, () => {
            cb && cb();
        })        
    })
}

module.exports = {
    command : command,
    add : add
}