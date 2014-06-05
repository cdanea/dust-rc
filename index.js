/**
 * Created by ciprian on 1/28/14.
 */

var dustrc = require('./lib/dustrc')({src: __dirname + '/tpl/', out: __dirname + "/public/js/dust/"});
dustrc.parse();
