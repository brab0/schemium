const path = __dirname.split('/');
const root = path.splice(0, path.length - 2).join('/');

const pkg = require(root + '/package.json');

const config = {
    name : pkg.name,
    description : pkg.description,
    author : pkg.author,
    repository : pkg.repository,
    license : pkg.license,
    homepage : pkg.homepage,
    commands : pkg.cliBuilder.commands,
    version : pkg.version
}

if(!pkg.bin){
    console.log("You need to configure you executable bin to run it globally!")
}

module.exports = config;