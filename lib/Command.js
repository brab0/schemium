const Option = require('./Option');

module.exports = class Command {
    constructor(command){
        this.name = command.name;
        this.main = command.main;
        this.description = command.description;
        this.options = command.options.map(option => new Option(option));
        this.options.push(new Option({            
            name : "help",
            type: Boolean
        }))
    }

    exec(options){
        if(options.help){
            this.help();
        } else {
            this.main(options);
        }        
    }

    help(){
        console.log('I am helping my command!');
    }
}