const path = require('path');

function renderList(projects){
    var separator = '---------------------------------------------------------------------------------------------------------------------------';
    var col = {
        name : '          NAME          ',
        cli : '          CLI          ',
        path : '                                  PATH                                  '
    }
    
    console.log(separator);
    console.log(`|${col.name}|${col.cli}|${col.path}|`)
    console.log(separator)
    
    projects.forEach(project => {        
        console.log(`| ${project.name + col.name.replace('NAME', '    ').slice(parseInt(project.name.length-1), col.name.length - 2)}| ${project.cli + col.cli.replace('CLI', '   ').slice(parseInt(project.cli.length-1), col.cli.length - 2)}| ${project.path + col.path.replace('PATH', '    ').slice(parseInt(project.path.length-1), col.path.length - 2)}|`);
    })

    console.log(separator)
}

function isSchemiumPath(schemiumPath, validCB){
    
    let config = {
        name : "",
        cli : "",
        path : schemiumPath == '.' ? process.cwd() : schemiumPath
    };
    
    try {        
        const pkg = require(path.resolve(config.path, 'package.json'));
        
        if(!pkg.schemium) validCB(false, config)
        
        config.name = pkg.name;
        config.cli = Object.keys(pkg.bin)[0];   

        validCB(true, config);
    } catch(ex) {
        validCB(false, config)
    }
}

function getByPath(cwd){
    const projects = require(path.resolve(__dirname, '../../projects.json'));    
    const index = projects.map(project => new RegExp(project.path).test(cwd)).indexOf(true);
    
    return projects[index].path;
}

module.exports = {
    renderList : renderList,
    isSchemiumPath : isSchemiumPath,
    getByPath : getByPath
}