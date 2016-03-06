import _ from 'underscore';
import { Events } from 'backbone';
import BoundedStack from './bounded-stack';

const Executer = function Executer(factory, levels) {
  this.factory = factory;
  this.undoStack = new BoundedStack(levels);
  this.redoStack = new BoundedStack(levels);
  this.addListeners();
};

_.extend(Executer.prototype, Events, {

  addListeners() {
    this.undoStack.on('empty', () => this.trigger('undo:disabled'));
    this.undoStack.on('nonempty', () => this.trigger('undo:enabled'));
    this.redoStack.on('empty', () => this.trigger('redo:disabled'));
    this.redoStack.on('nonempty', () => this.trigger('redo:enabled'));
  },

  do(name, ...args) {
    const command = this.factory.make(name, args);
    command.mode = 'do';
    const ret = command.execute(...command._args);
    if (command.register !== false) {
      this.undoStack.push(command);
      this.redoStack.reset();
    }
    this.trigger('do');
    return ret;
  },

  undo() {
    let ret;
    if (this.canUndo()) {
      const command = this.undoStack.pop();
      command.mode = 'undo';
      ret = command.unexecute(...command._args);
      this.redoStack.push(command);
      this.trigger('undo');
    }
    return ret;
  },

  redo() {
    let ret;
    if (this.canRedo()) {
      const command = this.redoStack.pop();
      command.mode = 'redo';
      ret = command.execute(...command._args);
      this.undoStack.push(command);
      this.trigger('redo');
    }
    return ret;
  },

  canUndo() {
    return !this.undoStack.isEmpty();
  },

  canRedo() {
    return !this.redoStack.isEmpty();
  },

});

export default Executer;
