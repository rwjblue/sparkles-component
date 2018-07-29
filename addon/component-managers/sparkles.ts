import Ember from 'ember';
import { set } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';
import SparklesComponent from '../';

interface Args {
  named: any;
  positional: any[];
}

export default class SparklesComponentManager {
  capabilities: any;

  static create(attrs: any) {
    let owner = getOwner(attrs);
    return new this(owner);
  }

  constructor(owner: any) {
    setOwner(this, owner);
    this.capabilities = Ember._componentManagerCapabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(Factory: typeof SparklesComponent, args: Args) {
    // TODO: fix this in Ember, we should receive the `.class` directly
    // but instead are receiving the `FactoryManager` (the private one)
    let instance = new Factory(args.named);
    setOwner(instance, getOwner(this))
  }

  updateComponent(component: SparklesComponent, args: Args) {
    set(component, 'args', args.named);
  }

  destroyComponent(component: SparklesComponent) {
    component.destroy();
  }

  getContext(component: SparklesComponent) {
    return component;
  }

  didCreateComponent(component: SparklesComponent) {
    component.didInsertElement();
  }

  didUpdateComponent(component: SparklesComponent) {
    component.didUpdate();
  }
}
