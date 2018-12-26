import ApplicationInstance from '@ember/application/instance';
import { setComponentManager } from '@ember/component';
import SparklesComponentManager from './component-managers/sparkles';

class SparklesComponent<T = object> {
  constructor(public args: T) {}

  didInsertElement() {}
  didUpdate() {}
  // TODO: should we have this?
  // didRender() {}
  destroy() {}
}

setComponentManager((owner: ApplicationInstance) => {
  return new SparklesComponentManager(owner)
}, SparklesComponent);

export default SparklesComponent;

export { tracked } from './tracked';

