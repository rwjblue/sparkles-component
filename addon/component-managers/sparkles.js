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

  createComponent(Klass, args) {
    return new Klass(args.named);
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
