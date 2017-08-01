function help(logger, name, config) {
    process.stdout.write("Sorry, Bro! You're on your own!\n");
}

help.readOptions = function (argv) {
    var cli = require('../util/cli');
    var options = cli.readOptions(argv);
    var name = options.argv.remain.slice(1).join(' ');

    return [name];
};

module.exports = help;
