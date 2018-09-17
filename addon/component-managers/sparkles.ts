import Ember from 'ember';
import { set } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';

export default class SparklesComponentManager {
  static create(attrs) {
    let owner = getOwner(attrs);
    return new this(owner);
  }
  capabilities: any;
  constructor(owner) {
    setOwner(this, owner);
    this.capabilities = Ember._componentManagerCapabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(Klass, args) {
    let instance = new Klass(args.named);
    setOwner(instance, getOwner(this));
    return instance;
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
