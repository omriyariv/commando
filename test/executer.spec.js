var setup = require('./setup'); // eslint-disable-line no-unused-vars
var sinon = require('sinon');
var expect = require('chai').expect;
var Executer = require('../src/executer').default;

describe('executer', function () {
  var executer = new Executer();
  var cmd = {
    execute: sinon.stub(),
    unexecute: sinon.stub(),
    setMode: sinon.stub(),
    _args: ['a', 'b']
  };

  describe('when calling the do() method', function () {
    it('should trigger a "do" event', function () {
      var cb = sinon.spy();
      executer.on('do', cb);
      executer.do(cmd);
      expect(cb).to.have.been.calledWith('do', cmd);
    });
  });
});
