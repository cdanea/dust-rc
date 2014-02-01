/**
 * Created by ciprian on 1/28/14.
 */

var dustrc = require('./dustrc')({src: __dirname + '/tpl/', out: __dirname + "/public/js/dust/"});
dustrc.parse();