var mkdirp = require('mkdirp');
var fs = require('fs');
var getDirName = require('path').dirname;

function write(params) {
    return new Promise((resolve, reject) => {
        mkdirp(getDirName(params.to), function (err) {
            if (err) reject(err);

            fs.writeFile(params.to, params.content, function(err){
                if (err) reject(err);

                resolve();
            });
        });
    });
}

function writeFromTpl(params) {
    return new Promise((resolve, reject) => {
        fs.readFile(params.from, function(oErr, tpl) {
            if(oErr) reject(oErr);

            return write({
                to: params.to,
                content: tpl
            })
            .then(res => resolve(res))
        });
    })
    .catch(ex => {
        throw new Error(ex)
    })
} 

module.exports = {
    write: write,
    writeFromTpl: writeFromTpl
}