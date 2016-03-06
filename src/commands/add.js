import Command from './command';

const AddCmd = Command.extend({

  execute(collection, models, options) {
    return collection.add(models, options);
  },

  unexecute(collection, models, options) {
    return collection.remove(models, options);
  },

});

export default AddCmd;
