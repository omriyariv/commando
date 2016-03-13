import _ from 'underscore';
import { Events } from 'backbone';

const BoundedStack = function BoundedStack(size) {
  this.stack = [];
  this.size = (size > 0 && size) || Number.MAX_VALUE;
};

_.extend(BoundedStack.prototype, Events, {

  push(element) {
    if (this.stack.length === this.size) {
      this.stack.shift();
    }

    this.stack.push(element);

    if (this.stack.length === 1) {
      this.trigger('nonempty');
    }

    return element;
  },

  pop() {
    let element;
    if (!this.isEmpty()) {
      element = this.stack.pop();
      if (this.isEmpty()) {
        this.trigger('empty');
      }
    }

    return element;
  },

  empty() {
    const wasEmpty = this.isEmpty();
    this.stack = [];
    if (!wasEmpty) {
      this.trigger('empty');
    }
  },

  isEmpty() {
    return this.stack.length === 0;
  },

});

export default BoundedStack;
