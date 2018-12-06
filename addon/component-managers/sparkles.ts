import { set } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import SparklesComponent from 'sparkles-component';
import { deprecate } from '@ember/debug';

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
  constructor(private owner: ApplicationInstance) {
    this.capabilities = capabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(Klass: typeof SparklesComponent, args: ComponentManagerArgs): CreateComponentResult {
    let { owner } = this;

    let instance = new Klass(args.named, owner);

    // check to make sure that owner was properly set, this ensures `super(...arguments)` was called
    if (getOwner(instance) !== owner) {
      deprecate(`must call super with all arguments in the constructor for ${Klass.name}`, false, { id: 'sparkles-component.super-arguments', until: '2.0.0' });
      setOwner(instance, owner);
    }

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
    component.didInsertElement();
  }

  didUpdateComponent(component: CreateComponentResult) {
    component.didUpdate();
  }
}
