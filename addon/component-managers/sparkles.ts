import { set } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import SparklesComponent from '../';

export interface ComponentManagerArgs {
  named: object;
  positional: any[];
}
type CreateComponentResult = SparklesComponent<object> & { ___createComponentResult: true };

export default class SparklesComponentManager {
  static create(attrs: any) {
    let owner = getOwner(attrs);
    return new this(owner);
  }
  capabilities: any;
  isInteractive: boolean;

  constructor(owner: ApplicationInstance) {
    setOwner(this, owner);
    this.isInteractive = getOwner(this).lookup('-environment:main').isInteractive;
    this.capabilities = capabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(Klass: typeof SparklesComponent, args: ComponentManagerArgs): CreateComponentResult {
    let instance = new Klass(args.named);
    setOwner(instance, getOwner(this));
    return instance as CreateComponentResult;
  }

  updateComponent(component: CreateComponentResult, args: ComponentManagerArgs) {
    set(component, 'args', args.named);
  }

  destroyComponent(component: CreateComponentResult) {
    component.destroy();
  }

  getContext(component: CreateComponentResult) {
    return component;
  }

  didCreateComponent(component: CreateComponentResult) {
    if (this.isInteractive) {
      component.didInsertElement();
    }
  }

  didUpdateComponent(component: CreateComponentResult) {
    if (this.isInteractive) {
      component.didUpdate();
    }
  }
}
