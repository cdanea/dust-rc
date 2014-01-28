/**
 * Created by ciprian on 1/28/14.
 */

var DustModule = function(config) {
    var
        _ = require('underscore'),
        fs = require('fs'),
        path = require('path'),
        dust = require('dustjs-linkedin'),
        options = _.extend({}, require('./config'), config),
        extension = options.ext,
        source = options.src,
        dest = options.out;

    dustrc = {
        options: options,
        parse: function(base, callback, ext) {
            if(typeof ext == typeof new Function) {
                callback = ext;
                ext = extension;
            } else {
                ext = ext || extension;
            }
            base = base || source || __dirname;
            if(typeof callback != typeof new Function) {
                callback = dustrc.compile;
            }
            var that = this,
                fileExt = ext && path.extname(("." + ext));
            fs.readdir(base, function(err, files){
                _.filter(files, function(file) {
                    return !_.contains(options.exclude, file);})
                    /*filtered*/.forEach(
                    function(fileName) {
                        var realPath = path.normalize(path.resolve(base, fileName));
                        fs.stat(realPath, function(err, stat){
                            if(stat.isFile() && (fileExt == path.extname(realPath))) {
                                var fDef = {file: realPath, base: options.src || __dirname, path:('/' + realPath.substring((options.src || __dirname).length)).replace(/^[\/]+/i, '')};
                                callback(fDef);
                            } else if(stat.isDirectory()) {
                                dustrc.parse(realPath, callback, fileExt);
                            } else {
                                // extension mismatch
                            }
                        });
                    }
                );
            });
        },
        compile: function(template) {
            var
                templateName = path.basename(template.file, path.extname(template.file)),
                destinationFile = path.join(dest, path.dirname(template.path), templateName + options.compiledExtension),
                destinationDir = path.dirname(destinationFile)
                ;
            fs.readFile(template.file, function(err, data) {
                if (err) {
                    throw err;
                }
                var compiled = dust.compile(String(data), templateName),
                    store = function(where, what) {
                        fs.writeFile(where, what, function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log('Saved ' + template.file + " > " + where);
                        });
                    };
                if (!fs.existsSync(destinationDir)) {
                    var mkdirp = require("mkdirp");
                    mkdirp(destinationDir, function (err) {
                        if (err) {
                            throw err;
                        }
                        else store(destinationFile, compiled);
                    });
                } else {
                    store(destinationFile, compiled);
                }
            });
        },
        watch: function(sourcePath) {
            var watch = require('watch');
            sourcePath = sourcePath || source || __dirname;
            watch.createMonitor(sourcePath, function(monitor){
                console.log('monitoring: ' + sourcePath);
                var compile = function() {
                    dustrc.parse(sourcePath);
                };
                monitor.on('change', compile);
                monitor.on('create', compile);
                monitor.on('remove', compile);
            });
        }
    }
    return dustrc;
};
module.exports = function(options) {return DustModule(options)};