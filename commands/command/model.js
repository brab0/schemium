const controller = require('./controller');

function command(options) {
    add(() => {
        console.log(options);
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
    command : command
}