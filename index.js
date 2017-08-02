const mout = require('mout');
const nopt = require('nopt');
const config = require(process.cwd() + '/package.json')

console.log(process.cwd() + '/package.json')

var knownCommands = [];
var index = 0;

function addCommand(schema) {
    console.log(index++)
    knownCommands.push(schema); 
}

function exec(args = null) {    
    process.bin = process.title = config.name;
    console.log('exec', index++)
    require('require-files').only(config.cliBuilder.commands.path);
    console.log('exec', index++)
    // normalize args to have two initial positions no matter what
    if(args){
        args = args.split(' ');
        
        if(args.indexOf(mout.object.keys(config.bin)[0]) > -1){                    
            args[0] = null;
            args.splice(1, 0, null);
        } else {            
            args.splice(0, 0, null);
            args.splice(0, 0, null);
        }
    }    
    
    args = args || process.argv;    

    executeCommandLine(args);
}

function executeCommandLine(args){
    const executedCommands = knownCommands.filter(function(cmd) {
        return args.indexOf(cmd.name) !== -1;
    });        

    if(executedCommands.length > 0){         
        const options = mout.array.difference(args, executedCommands);
        const command = executedCommands[0];
        const parsedOptions = readOptions(command.options, options);

        command && command.main(parsedOptions);
    }
}

function readOptions(options, args) {
    var parsedOptions = {};
    
    var types = mout.object.map(options, function (option) {
        return option.type;
    });    
    
    var noptOptions = nopt(types, [], args, 2);    
    
    mout.object.forOwn(noptOptions, function (value, key) {
        if (options[key]) {
            parsedOptions[mout.string.camelCase(key)] = value;
        }
    });

    return parsedOptions;
}

module.exports = {
    exec : exec,
    addCommand : addCommand
}