(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('backbone'), require('underscore')) :
  typeof define === 'function' && define.amd ? define(['backbone', 'underscore'], factory) :
  (global.commando = factory(global.Backbone,global._));
}(this, function (Backbone,_) { 'use strict';

  var Backbone__default = 'default' in Backbone ? Backbone['default'] : Backbone;
  _ = 'default' in _ ? _['default'] : _;

  var babelHelpers = {};

  babelHelpers.toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  babelHelpers;

  var BoundedStack = function BoundedStack(size) {
    this.stack = [];
    this.size = size > 0 && size || Number.MAX_VALUE;
  };

  _.extend(BoundedStack.prototype, Backbone.Events, {
    push: function push(element) {
      if (this.stack.length === this.size) {
        this.stack.shift();
      }

      this.stack.push(element);

      if (this.stack.length === 1) {
        this.trigger('nonempty');
      }

      return element;
    },
    pop: function pop() {
      var element = void 0;
      if (!this.isEmpty()) {
        element = this.stack.pop();
        if (this.isEmpty()) {
          this.trigger('empty');
        }
      }

      return element;
    },
    empty: function empty() {
      var wasEmpty = this.isEmpty();
      this.stack = [];
      if (!wasEmpty) {
        this.trigger('empty');
      }
    },
    isEmpty: function isEmpty() {
      return this.stack.length === 0;
    }
  });

  var Executer = function Executer(levels) {
    this.undoStack = new BoundedStack(levels);
    this.redoStack = new BoundedStack(levels);
    this.addListeners();
  };

  _.extend(Executer.prototype, Backbone.Events, {
    addListeners: function addListeners() {
      var _this = this;

      this.undoStack.on('empty', function () {
        return _this.trigger('undo:disabled');
      });
      this.undoStack.on('nonempty', function () {
        return _this.trigger('undo:enabled');
      });
      this.redoStack.on('empty', function () {
        return _this.trigger('redo:disabled');
      });
      this.redoStack.on('nonempty', function () {
        return _this.trigger('redo:enabled');
      });
    },
    do: function _do(command) {
      command.setMode('do');
      var ret = command.execute.apply(command, babelHelpers.toConsumableArray(command._args));
      if (command.register !== false) {
        this.undoStack.push(command);
        this.redoStack.empty();
      }
      this.trigger('do');
      return ret;
    },
    undo: function undo() {
      var ret = void 0;
      if (this.canUndo()) {
        var command = this.undoStack.pop();
        command.setMode('undo');
        ret = command.unexecute.apply(command, babelHelpers.toConsumableArray(command._args));
        this.redoStack.push(command);
        this.trigger('undo');
      }
      return ret;
    },
    redo: function redo() {
      var ret = void 0;
      if (this.canRedo()) {
        var command = this.redoStack.pop();
        command.setMode('redo');
        ret = command.execute.apply(command, babelHelpers.toConsumableArray(command._args));
        this.undoStack.push(command);
        this.trigger('redo');
      }
      return ret;
    },
    canUndo: function canUndo() {
      return !this.undoStack.isEmpty();
    },
    canRedo: function canRedo() {
      return !this.redoStack.isEmpty();
    }
  });

  var Factory = function Factory() {
    this.map = {};
  };

  _.extend(Factory.prototype, {
    register: function register(name, command) {
      this.map[name] = command;
    },
    make: function make(name, args) {
      var Cmd = this.map[name];
      if (Cmd) {
        return new Cmd({
          factory: this,
          executer: new Executer()
        }, args);
      }
      throw new Error('Command is not registered: ' + name);
    }
  });

  var Command = function Command(deps, args) {
    this._deps = deps;
    this._args = args;
    this.initialize.apply(this, args);
  };

  _.extend(Command.prototype, Backbone.Events, {

    register: undefined,

    initialize: function initialize() {},
    execute: function execute() {},
    unexecute: function unexecute() {
      while (this._deps.executer.canUndo()) {
        this._deps.executer.undo();
      }
    },
    do: function _do() {
      var _deps$factory;

      var cmd = (_deps$factory = this._deps.factory).make.apply(_deps$factory, arguments);
      return this._deps.executer.do(cmd);
    },
    setMode: function setMode(mode) {
      this._mode = mode;
    },
    getMode: function getMode() {
      return this._mode;
    }
  });

  Command.extend = Backbone.Model.extend;

  var SetCmd = Command.extend({
    initialize: function initialize(model) {
      this.prevAttrs = _.clone(model.attributes);
    },
    execute: function execute(model, attrs, options) {
      return model.set(attrs, options);
    },
    unexecute: function unexecute(model, attrs, options) {
      return model.set(this.prevAttrs, options);
    }
  });

  var AddCmd = Command.extend({
    execute: function execute(collection, models, options) {
      return collection.add(models, options);
    },
    unexecute: function unexecute(collection, models, options) {
      return collection.remove(models, options);
    }
  });

  var RemoveCmd = Command.extend({
    execute: function execute(collection, models, options) {
      return collection.remove(models, options);
    },
    unexecute: function unexecute(collection, models, options) {
      return collection.add(models, options);
    }
  });

  var Commando = Backbone__default.Commando = function Commando(options) {
    this.options = options || {};
    this.factory = new Factory();
    this.executer = new Executer(this.options.levels);
    this._registerCommands();
    this._initProxyEvents();
  };

  _.extend(Commando.prototype, Backbone.Events, {
    register: function register(name, command) {
      return this.factory.register(name, command);
    },
    do: function _do() {
      var _factory;

      var cmd = (_factory = this.factory).make.apply(_factory, arguments);
      return this.executer.do(cmd);
    },
    undo: function undo() {
      var _executer;

      return (_executer = this.executer).undo.apply(_executer, arguments);
    },
    redo: function redo() {
      var _executer2;

      return (_executer2 = this.executer).redo.apply(_executer2, arguments);
    },
    canUndo: function canUndo() {
      return this.executer.canUndo();
    },
    canRedo: function canRedo() {
      return this.executer.canRedo();
    },
    _registerCommands: function _registerCommands() {
      this.register('set', SetCmd);
      this.register('add', AddCmd);
      this.register('remove', RemoveCmd);
    },
    _initProxyEvents: function _initProxyEvents() {
      this.executer.on('all', this._triggerProxyEvent, this);
    },
    _triggerProxyEvent: function _triggerProxyEvent() {
      this.trigger.apply(this, arguments);
    }
  });

  Commando.Command = Command;

  return Commando;

}));
//# sourceMappingURL=commando.js.map