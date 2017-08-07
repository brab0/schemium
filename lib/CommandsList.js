module.exports = class CommandsList {
    
    constructor(items = []){
        this.items = items;
    }

    add(item){
        this.items.push(item)
    }

    get(index = null, comparables = null) {
        if(index !== null && comparables){
            return this.items.filter(item => comparables.indexOf(item.name) !== -1 || comparables.indexOf(item.abbrev) !== -1)[index];
        } else if(index !== null && !comparables){
            return this.items[index];
        } else if(!index && comparables){
            return this.items.filter(item => comparables.indexOf(item.name) !== -1 || comparables.indexOf(item.abbrev) !== -1);
        } else {
            return this.items;
        }
    }    
}