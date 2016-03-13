import { Events, Model } from 'backbone';
import _ from 'underscore';

const Command = function Command(deps, args) {
  this._deps = deps;
  this._args = args;
  this.initialize.apply(this, args);
};

_.extend(Command.prototype, Events, {

  register: undefined,

  initialize() {},

  execute() {},

  unexecute() {
    while (this._deps.executer.canUndo()) {
      this._deps.executer.undo();
    }
  },

  do(...args) {
    const cmd = this._deps.factory.make(...args);
    return this._deps.executer.do(cmd);
  },

  setMode(mode) {
    this._mode = mode;
  },

  getMode() {
    return this._mode;
  },

});

Command.extend = Model.extend;

export default Command;
