import Command from './command';
import Executer from '../executer';

const CompositeCommand = Command.extend({

  constructor(deps) {
    this.executer = new Executer(deps.factory);
    Command.apply(this, arguments);
  },

  do(...args) {
    return this.executer.do(...args);
  },

  unexecute() {
    while (this.executer.canUndo()) {
      this.executer.undo();
    }
  },

});

export default CompositeCommand;
