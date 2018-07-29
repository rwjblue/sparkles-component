import Ember from 'ember';
import { set } from '@ember/object';

export default class SparklesComponentManager {
  static create(attrs) {
    return new this(attrs);
  }

  constructor() {
    this.capabilities = Ember._componentManagerCapabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(Factory, args) {
    // TODO: fix this in Ember, we should receive the `.class` directly
    // but instead are receiving the `FactoryManager` (the private one)
    return new Factory.class(args.named);
  }

  updateComponent(component, args) {
    set(component, 'args', args.named);
  }

  destroyComponent(component) {
    component.destroy();
  }

  getContext(component) {
    return component;
  }

  didCreateComponent(component) {
    component.didInsertElement();
  }

  didUpdateComponent(component) {
    component.didUpdate();
  }
}
