const Option = require('./Option');

module.exports = class Command {
    constructor(command){
        this.name = command.name;
        this.abbrev = command.abbrev;
        this.main = command.main;
        this.description = command.description;
        this.options = command.options.map(option => new Option(option));
        this.options.push(new Option({            
            name : "help",
            abbrev: 'h',
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
        var pad = "                                   ";
        
        console.log(`${this.name}, ${this.abbrev}        ${this.description}`)

        this.options.forEach(opt => {
            if(opt.name !== 'help'){                
                
                var str = `--${opt.name}, -${opt.abbrev}`;                
                var out = str + pad.slice(parseInt(str.length-1), pad.length);

                console.log(`  ${out}${opt.description}`)
            }
        });

        console.log()
    }
}