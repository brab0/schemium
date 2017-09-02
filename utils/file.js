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
    return read(params.from)
    .then(res => write({
        to: params.to,
        content: tpl
    }))
    .catch(ex => {
        throw new Error(ex)
    })
}

function read(from){
    return new Promise((resolve, reject) => {
        fs.readFile(from, function(oErr, tpl) {
            if(oErr) reject(oErr);

            return resolve(tpl);
        });
    })
    .catch(ex => {
        throw new Error(ex)
    })
}

module.exports = {
    write: write,
    writeFromTpl: writeFromTpl,
    read : read,
    exists : fs.stat
}