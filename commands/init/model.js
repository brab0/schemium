const controller = require('./controller');

function init(options) {
    controller.prompt(options.path)        
}

module.exports = {
    init : init
}