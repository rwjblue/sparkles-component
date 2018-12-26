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

// if (ember >= '3.8.0') {
//   setComponentManager((owner: ApplicationInstance) => {
//     return new SparklesComponentManager(owner)
//   }, SparklesComponent);
// } else {
  setComponentManager('sparkles', SparklesComponent);
// }

export default SparklesComponent;

export { tracked } from './tracked';

