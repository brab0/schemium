const path = require('path');

function renderList(projects) {                     
    var separator = '───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────';
    var col = {
        name: '          NAME          ',
        cli: '          CLI          ',
        path: '                                  PATH                                  '
    }

    console.log(separator);
    console.log(`|${col.name}|${col.cli}|${col.path}|`)
    console.log(separator)

    projects.forEach(project => {
        console.log(`| ${project.name + col.name.replace('NAME', '    ').slice(parseInt(project.name.length - 1), col.name.length - 2)}| ${project.cli + col.cli.replace('CLI', '   ').slice(parseInt(project.cli.length - 1), col.cli.length - 2)}| ${project.path + col.path.replace('PATH', '    ').slice(parseInt(project.path.length - 1), col.path.length - 2)}|`);
    })

    console.log(separator)
}

function isSchemiumPath(schemiumPath) {
    let config = {
        name: "",
        cli: "",
        path: schemiumPath == '.' ? process.cwd() : schemiumPath
    };

    return new Promise((resolve, reject) => {
        const pkg = require(path.resolve(config.path, 'package.json'));

        if (!pkg.schemium || !getByPath(config.path)) reject()

        config.name = pkg.name;
        config.cli = Object.keys(pkg.bin)[0];

        resolve(config);
    })
    .catch(ex => {
        console.log(`The current path is not a valid schemium\'s project: ${config.path}`)
    });
}

function getByPath(cwd) {    
    const projectsList = require(path.resolve(__dirname, '../../projects.json'));
    const project = projectsList.filter(project => project.path == cwd)[0];
    
    if (project) {
        return project.path;
    } else {
        throw new Error('It seems this path is not a valid schemium\'s project.');        
    }
}

module.exports = {
    renderList: renderList,
    isSchemiumPath: isSchemiumPath,
    getByPath: getByPath
}