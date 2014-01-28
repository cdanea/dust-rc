dust-rc
=======

###Dust recursive compiler

Small utility to compile a directory of dust.js templates to a target directory of compiled JS resources. Tree structure is preserved.

    var dirCompiler = require('./dustrc')({src: __dirname + '/tpl/', out: __dirname + "/public/js/dust/"});
    dirCompiler.parse();
