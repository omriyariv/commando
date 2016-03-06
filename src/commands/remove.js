import Command from './command';

const RemoveCmd = Command.extend({

  execute(collection, models, options) {
    return collection.remove(models, options);
  },

  unexecute(collection, models, options) {
    return collection.add(models, options);
  },

});

export default RemoveCmd;
