/**
 * Created by ciprian on 6/5/14.
 */
var
  chai = require('chai'),
  expect = chai.expect,
  path = require('path'),
  dustrc = require('../lib/dustrc'),
  dust = require('dustjs-linkedin')

  ;

chai.should();

describe("Basic initial test.", function () {
  it("Should work!", function (done) {
    var options = {
      src: path.join(__dirname, "tpl"),
      base: path.join(__dirname, "tpl"),
      out: path.join(__dirname, "out"),
      quiet: true
    };
    var tplCompiler = dustrc(options);
    tplCompiler.should.be.an('object');
    tplCompiler.parse(options.src, function (error, templates) {
      expect(error).to.be.not.ok;
      templates.should.be.an('array');
      templates.length.should.equal(1);
      done();
    });
  });

});
