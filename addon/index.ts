import { setComponentManager } from '@ember/component';
import { tracked } from './tracked';

class SparklesComponent<T = object> {
  @tracked args: T;

  constructor(args: T) {
    this.args = args;
  }

  didInsertElement() {}
  didUpdate() {}
  // TODO: should we have this?
  // didRender() {}
  destroy() {}
}
setComponentManager('sparkles', SparklesComponent);

export default SparklesComponent;

export { tracked } from './tracked';
