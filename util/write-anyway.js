module.exports = function(path, contents, cb) {
    var mkdirp = require('mkdirp');
    var fs = require('fs');
    var getDirName = require('path').dirname;

    mkdirp(getDirName(path), function (err) {
        if (err) return cb(err);

        fs.writeFile(path, contents, cb);
    });
} 