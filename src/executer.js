import _ from 'underscore';
import { Events } from 'backbone';
import BoundedStack from './bounded-stack';

const Executer = function Executer(levels) {
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

  do(command) {
    command.setMode('do');
    const ret = command.execute(...command._args);
    if (command.register !== false) {
      this.undoStack.push(command);
      this.redoStack.empty();
    }
    this.trigger('do', command);
    return ret;
  },

  undo() {
    let ret;
    if (this.canUndo()) {
      const command = this.undoStack.pop();
      command.setMode('undo');
      ret = command.unexecute(...command._args);
      this.redoStack.push(command);
      this.trigger('undo', command);
    }
    return ret;
  },

  redo() {
    let ret;
    if (this.canRedo()) {
      const command = this.redoStack.pop();
      command.setMode('redo');
      ret = command.execute(...command._args);
      this.undoStack.push(command);
      this.trigger('redo', command);
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
