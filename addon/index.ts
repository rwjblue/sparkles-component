import { setComponentManager } from '@ember/component';
import { setOwner } from '@ember/application';

class SparklesComponent<T = object> {
  constructor(public args: T, owner: any | undefined) {
    if (owner) {
      setOwner(this, owner);
    }
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
