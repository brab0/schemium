const controller = require('./controller');

function command() {
    add(null,() => {        
        process.exit(0);
    })
}

function add(path = null, cb){    
    controller.promptCommand(path, () => cb())
}

module.exports = {
    command : command,
    add : add
}