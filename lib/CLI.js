const mout = require('mout');
const nopt = require('nopt');
const config = require('../config');

module.exports = class CLI {
    constructor(commands){
        this.commands = commands;
        this.args = process.argv;
        this.command = commands.get(0, this.args);
        this.options = {};
        
        if(this.command){            
            this.setValidOptions();
        }
    }    

    setValidOptions(){         

        var types = this.command.options.map(option => {               
            return Object[option.name] = option.type;
        });                

        // by now we won't work with shorthands(2° param)
        var noptOptions = nopt(types, [], this.args, 2);        

        mout.object.forOwn(noptOptions, (value, key) => {            
            this.command.options.forEach(opt => {
                if((opt.name == key) || (opt.abbrev == key)){
                    this.options[mout.string.camelCase(opt.name)] = value;
                }
            });
        });
    }

    help(){
        console.log(`${config.name} v${config.version}`);
        console.log(`${config.description}`);        
        console.log();
        console.log(`Usage: ${config.name} <command> [<option>]`);
        console.log();
        this.commands.items.forEach(cmd => {
            cmd.help();
        });
        console.log(`See more at: ${config.homepage}`);
        console.log();
    }

    version(){
        console.log(`v${config.version}`)
    }

    exec(){        
        if(!this.command){
            if(this.args.some(arg => arg == '--version' || arg == '-v')){
                this.version()
            } else {
                this.help();
            }            
        } else {            
            this.command.exec(this.options);
        }
    }
}