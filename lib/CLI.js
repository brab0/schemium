const mout = require('mout');
const nopt = require('nopt');
const config = require('../config');

module.exports = class CLI {
    constructor(commands){        
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
            if (this.command.options.some(opt => opt.name == key)) {
                this.options[mout.string.camelCase(key)] = value;
            }
        });
    }

    help(){
        console.log('I am helping!')
    }

    version(){
        console.log(config.version)
    }

    exec(){        
        if(!this.command){
            if(this.args.some(arg => arg == '--version')){
                this.version()
            } else {
                this.help();
            }            
        } else {            
            this.command.exec(this.options);
        }
    }
}