import Command from './command';
import _ from 'underscore';

const SetCmd = Command.extend({

  initialize(model) {
    this.prevAttrs = _.clone(model.attributes);
  },

  execute(model, attrs, options) {
    return model.set(attrs, options);
  },

  unexecute(model, attrs, options) {
    return model.set(this.prevAttrs, options);
  },

});

export default SetCmd;
