import Ember from 'ember';

class SparklesComponent {
  public args: any;

  constructor(args: any) {
    this.args = args;
  }

  didInsertElement() {}
  didUpdate() {}
  destroy() {}
}
interface ISetComponentManager {
  (managerId: string, factory: Function): Function;
}
const setComponentManager: ISetComponentManager = Ember._setComponentManager;
setComponentManager('sparkles', SparklesComponent);

export default SparklesComponent;

export { tracked } from './tracked';
