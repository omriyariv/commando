import _ from 'underscore';

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
      return new Cmd({ factory: this }, args);
    }
    throw new Error(`Command is not registered: ${name}`);
  },

});

export default Factory;
