/**
 * Created by ciprian on 6/5/14.
 */
var chai = require('chai'), expect = chai.expect, path = require('path');
chai.should();

describe("Basic initial test", function () {

  beforeEach(function () {
    //
  });
  afterEach(function () {
    //
  });
  it("Should work", function () {
    var opt = {src: path.join(__dirname, "tpl"), base: path.join(__dirname, "tpl"), out: path.join(__dirname, "out")};
//    var
//      options = {
//        src: __dirname + '/tpl/',
//        out: __dirname + "/public/js/dust/"
//      },
//    dirCompiler.parse();
    var tplCompiler = require('../lib/dustrc')(opt);
    tplCompiler.should.be.an('object');
    tplCompiler.parse(opt.src);
  });
});
