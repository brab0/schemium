function commandFactory(id) {
    function runFromArgv(argv) {
        var commandArgs;
        var command = require(id);

        commandArgs = command.readOptions(argv);

        return command.apply(undefined, commandArgs);        
    }

    return runFromArgv;
}

module.exports = {
    help: commandFactory('./help')
};