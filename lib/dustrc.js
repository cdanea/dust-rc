/**
 * Created by ciprian on 1/28/14.
 */

var
  _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  dust = require('dustjs-linkedin');

var DustModule = function (config) {
  var
    options = _.extend({}, require('./config'), config),
    extension = options.ext,
    source = options.src,
    dest = options.out,
    dustrc = {
    options: options,
    parse: function (base, ext, callback) {
      var files = [];
      var compile = dustrc.compile;
      if(!callback && ext instanceof Function) {
        callback = ext;
        ext = null;
      }
      ext = ext || extension;
      base = base || source || __dirname;
      ext = ext && path.extname(("." + ext));
      fs.readdir(base, function (err, files) {
        _.filter(files, function (file) {
          return !_.contains(options.exclude, file);
        })
          /*filtered*/.forEach(
          function (fileName) {
            var realPath = path.normalize(path.resolve(base, fileName));
            fs.stat(realPath, function (err, stat) {
              if (stat.isFile() && (ext == path.extname(realPath))) {
                var fDef = {
                  file: realPath,
                  base: options.src || __dirname,
                  path: ('/' + realPath.substring((options.src || __dirname).length)).replace(/^[\/]+/i, '')
                };
                compile(fDef);
                files.push(fDef);
              } else if (stat.isDirectory()) {
                dustrc.parse(realPath, ext);
              } else {
                // extension mismatch: ignore
              }
            });
          }
        );
        callback instanceof Function && callback(err, files);
      });
    },
    compile: function (template, callbackCompile) {
      var
        templateName = path.basename(template.file, path.extname(template.file)),
        destinationFile = path.join(dest, path.dirname(template.path), templateName + options.compiledExtension),
        destinationDir = path.dirname(destinationFile)
      ;
      callbackCompile |= new Function;
      fs.readFile(template.file, function (err, data) {
        if (err) {
          throw err;
        }
        var compiled = dust.compile(String(data), templateName),
          store = function (where, what, callbackStoreAction) {
            fs.writeFile(where, what, function (err) {
              if (err) {
                throw err;
              }
              options.quiet || console.log('Saved ' + template.file + " > " + where);
              callbackStoreAction instanceof Function && callbackStoreAction();
            });
          };
        if (!fs.existsSync(destinationDir)) {
          var mkdirp = require("mkdirp");
          mkdirp(destinationDir, function (err) {
            if (err) {
              throw err;
            }
            else store(destinationFile, compiled, callbackCompile);
          });
        } else {
          store(destinationFile, compiled, callbackCompile);
        }
      });
    },
    watch: function (sourcePath) {
      var watch = require('watch');
      sourcePath = sourcePath || source || __dirname;
      watch.createMonitor(sourcePath, function (monitor) {
        options.quiet || console.log('monitoring: ' + sourcePath);
        var compile = function () {
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
module.exports = function (options) {
  return DustModule(options)
};
