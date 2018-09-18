import Ember from 'ember';

class SparklesComponent<T = object> {
  constructor(public args: T) {}

  didInsertElement() {}
  didUpdate() {}
  // TODO: should we have this?
  // didRender() {}
  destroy() {}
}

Ember._setComponentManager('sparkles', SparklesComponent);

export default SparklesComponent;

export { tracked } from './tracked';
