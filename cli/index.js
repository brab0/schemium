const mout = require('mout');
const nopt = require('nopt');


let commands = [];
let config = {};

function init(config) {    
    require('require-files').only(config.commands.path);

    process.bin = process.title = config.process_title;

    return this;
}

function addCommand(schema) {    
    commands.push(schema);
}

function exec(argc = null) {
    let args = process.argv || argc && argc.split(' ');
    
    executeCommandLine(commands, args);
}

function getVersion() {
    return require(process.cwd() + '/package.json').version;
}

function executeCommandLine(commands, args){        

    const command = commands.filter(function(cmd) {
        return args.indexOf(cmd.name) !== -1;
    })[0];
    
    console.log(nopt(command.options.map(function(opt) { return }), null, args, 2))

    const options = command.options.filter(function(opt) {
        return args.indexOf(opt.flag) !== -1 || args.indexOf(opt.shorthand) !== -1;
    });

    command && command.main(options);
}

module.exports = {
    init : init,
    exec : exec,
    addCommand : addCommand
}