var path = require('path');

function main(options) {
    if(options.use){
        use(options.use)
    }

    if(options.list){
        list()
    }

    if(options.add){
        add(options.add)
    }

    if(options.remove){
        remove(options.remove)
    }
}

function use(value){
    console.log(value)
}

function list(){
    var projects = require(path.resolve(__dirname, '../projects.json'));

    var separator = '-----------------------------------------------------------------------------------------------------------------------------------';
    var col = {
        name : '             NAME             ',
        command : '            COMMAND            ',
        path : '                               PATH                               '
    }
    
    console.log(separator);
    console.log(`|${col.name}|${col.command}|${col.path}|`)
    console.log(separator)
    projects.forEach(project => {        
        console.log(`| ${project.name + col.name.replace('NAME', '    ').slice(parseInt(project.name.length-1), col.name.length - 2)}| ${project.command + col.command.replace('COMMAND', '       ').slice(parseInt(project.command.length-1), col.command.length - 2)}| ${project.path + col.path.replace('PATH', '    ').slice(parseInt(project.path.length-1), col.path.length - 2)}|`)        
    })
    console.log(separator)
}

function add(value){
    console.log(value)
}

function remove(value){
    console.log(value)
}

require('schemium-api').command({
    name: 'project',
    abbrev: 'p',
    main : main,
    description : 'projects',
    options : [{
        name: 'use',
        abbrev: 'u',
        type : String,
        description : ''
    }, {
        name: 'list',
        abbrev: 'ls',
        type : Boolean,
        description : ''
    }, {
        name: 'add',
        abbrev: 'a',
        type : String,
        description : ''
    }, {
        name: 'remove',
        abbrev: 'rm',
        type : String,
        description : ''
    }]
});