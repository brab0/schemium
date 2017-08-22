const controller = require('./controller');
const { treeView } = require('../project/model');

function command() {
    add(null,() => { 
        process.exit(0);        
    })
}

function add(path = null, cb){    
    controller.promptCommand(path, () => {
        treeView(path, 'node_modules', () => {
            cb && cb();
        })        
    })
}

module.exports = {
    command : command,
    add : add
}