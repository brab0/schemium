module.exports = class Option {
    constructor(option) {
        this.name = option.name;
        this.abbrev = option.abbrev;
        this.type = option.type;
        this.description = option.description;        
    }
}