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
    return new Promise((resolve, reject) => {
        let config = {
            name: "",
            cli: "",
            path: schemiumPath == '.' ? process.cwd() : schemiumPath
        };

        const pkg = require(path.resolve(config.path, 'package.json'));

        if (!pkg.schemium) reject()

        config.name = pkg.name;
        config.cli = Object.keys(pkg.bin)[0];

        resolve(config);
    })
    .catch(ex => {
        throw new Error(`The current path is not a valid schemium\'s project: ${config.path}`)
    });
}

function getByPath(cwd) {
    return new Promise((resolve, reject) => {
        const projectsList = require(path.resolve(__dirname, '../../projects.json'));
        const project = projectsList.filter(project => project.path == cwd)[0];
        
        if (project) {
            resolve(project.path);
        } else {
            reject('It seems this path is not a valid schemium\'s project.');        
        }
    })
}

module.exports = {
    renderList: renderList,
    isSchemiumPath: isSchemiumPath,
    getByPath: getByPath
}