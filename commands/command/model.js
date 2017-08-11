const controller = require('./controller');

function command() {
    add(() => {        
        process.exit(0);
    })
}

function add(path = null, cb){
    controller.promptCommand(() => {
        controller.promptOptions(path, () => {
            cb()
        })
    })
}

module.exports = {
    command : command,
    add : add
}