import Ember from 'ember';

class SparklesComponent {
  args: any;
  constructor(args) {
    this.args = args;
  }

  didInsertElement() {}
  didUpdate() {}
  // TODO: should we have this?
  // didRender() {}
  destroy() {}
}

Ember._setComponentManager('sparkles', SparklesComponent);

export default SparklesComponent;

export { tracked } from './tracked';
