dust-rc
=======

###Dust recursive compiler

Small utility to compile a directory of dust.js templates to a target directory of compiled JS resources. Tree structure is preserved.

    var
        options = {
            src: __dirname + '/tpl/',
            out: __dirname + "/public/js/dust/"
        },
    dirCompiler = require('./dustrc')(options);
    dirCompiler.parse();
