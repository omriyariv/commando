import Backbone, { Events } from 'backbone';
import _ from 'underscore';
import Factory from './factory';
import Executer from './executer';
import SetCmd from './commands/set';
import AddCmd from './commands/add';
import RemoveCmd from './commands/remove';
import Command from './commands/command';
import CompositeCommand from './commands/composite';

const Commando = Backbone.Commando = function Commando(options) {
  this.options = options || {};
  this.factory = new Factory();
  this.executer = new Executer(this.factory, this.options.levels);
  this._registerCommands();
  this._initProxyEvents();
};

_.extend(Commando.prototype, Events, {

  register(name, command) {
    return this.factory.register(name, command);
  },

  do(...args) {
    return this.executer.do(...args);
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
Commando.CompositeCommand = CompositeCommand;

export default Commando;
