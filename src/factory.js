import _ from 'underscore';
import Executer from './executer';

const Factory = function Factory() {
  this.map = {};
};

_.extend(Factory.prototype, {

  register(name, command) {
    this.map[name] = command;
  },

  make(name, args) {
    const Cmd = this.map[name];
    if (Cmd) {
      return new Cmd({
        factory: this,
        executer: new Executer(),
      }, args);
    }
    throw new Error(`Command is not registered: ${name}`);
  },

});

export default Factory;
