const controller = require('./controller');

function command() {
    add(() => {        
        process.exit(0);
    })
}

function add(cb){
    controller.promptCommand(() => {
        controller.promptOptions(() => {
            cb()
        })
    })
}

module.exports = {
    command : command,
    add : add
}