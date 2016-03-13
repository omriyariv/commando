import Backbone, { Events } from 'backbone';
import _ from 'underscore';
import Factory from './factory';
import Executer from './executer';
import SetCmd from './commands/set';
import AddCmd from './commands/add';
import RemoveCmd from './commands/remove';
import Command from './commands/command';

const Commando = Backbone.Commando = function Commando(options) {
  this.options = options || {};
  this.factory = new Factory();
  this.executer = new Executer(this.options.levels);
  this._registerCommands();
  this._initProxyEvents();
};

_.extend(Commando.prototype, Events, {

  register(name, command) {
    return this.factory.register(name, command);
  },

  do(...args) {
    const cmd = this.factory.make(...args);
    return this.executer.do(cmd);
  },

  undo(...args) {
    return this.executer.undo(...args);
  },

  redo(...args) {
    return this.executer.redo(...args);
  },

  canUndo() {
    return this.executer.canUndo();
  },

  canRedo() {
    return this.executer.canRedo();
  },

  _registerCommands() {
    this.register('set', SetCmd);
    this.register('add', AddCmd);
    this.register('remove', RemoveCmd);
  },

  _initProxyEvents() {
    this.executer.on('all', this._triggerProxyEvent, this);
  },

  _triggerProxyEvent(...args) {
    this.trigger(...args);
  },

});

Commando.Command = Command;

export default Commando;
