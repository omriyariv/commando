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

  unexecute() {},

});

Command.extend = Model.extend;

export default Command;
