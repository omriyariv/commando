
var commando = new Backbone.Commando({levels: 100});

commando.register('doSomething', DoSomething);
commando.do('something', arg1, arg2);
commando.undo(steps);
commando.redo(steps);
commando.canUndo();
commando.canRedo();
commando.history;

commando.do('set', model, attrs);
commando.undo();

MyCommand = Backbone.Commando.Simple.extend({
   
    name: 'doSmothing',

    execute: function() {
        this.do('subtask', 1, 2, 3);
    },

    unexecute: function() {
        while(this.canUndo()) {
            this.undo();
        }
    }

});

initialize: function(model, attrs, options) {
    this.prevAttrs = model.toJSON();
},

execute: function() {
    return model.set(attrs, options);
},

unexecute: function() {
    return model.set(this.prevAttrs, options);
}

commando.do('set', model, attrs, options);
commando.do('de')


MyCommand = Backbone.Commando.Composite.extend({
   
    name: 'comp1',

    execute: function() {
        this.do('set', model, {cool: true});
    },

    unexecute: function() {
        while(this.canUndo) {
            this.undo();
        }
    }

});