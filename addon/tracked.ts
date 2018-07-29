import Ember from 'ember';
import { assert } from '@ember/debug';
import { addObserver } from '@ember/object/observers';

function setupObservers(instance: any, dependentKeys: string[], notifyMethod: ObserverMethod<any, any>) {
  for (let i = 0; i < dependentKeys.length; i++) {
    let dependentKey = dependentKeys[i];
    addObserver(instance, dependentKey, instance, notifyMethod);
  }
}

function descriptorForTrackedComputedProperty(_target: any, key: any, descriptor: PropertyDescriptor, ...dependencies: any[]) {
  // TODO: really should use WeakSet here, but that isn't available on IE11
  const OBSERVERS_SETUP = new WeakMap();

  assert(
    `You cannot use property paths with the tracked decorator, but for ${key} you specified \`${dependencies.join('`, `')}\`.`,
    (function() {
      for (let i = 0; i < dependencies.length; i++) {
        if (dependencies[i].indexOf('.') > -1) {
          return false;
        }
      }

      return true;
    })()
  );
  let getterProvided = descriptor.get;
  let setterProvided = descriptor.set;

  // will be bound to the instance when invoked
  function notify(this: any) {
    Ember.notifyPropertyChange(this, key);
  }

  descriptor.get = function(this: any) {
    if (!OBSERVERS_SETUP.has(this)) {
      setupObservers(this, dependencies, notify);
      OBSERVERS_SETUP.set(this, true);
    }

    return getterProvided.call(this);
  };

  if (setterProvided) {
    descriptor.set = function(this: any, value) {
      Ember.notifyPropertyChange(this, key);

      setterProvided.call(this, value);
    };
  }

  return descriptor;
}

function installTrackedProperty(_target: any, key: string, descriptor: PropertyDescriptor) {
  let initializer = descriptor && descriptor.initializer;
  let values = new WeakMap();

  let get;
  if (initializer) {
    get = function(this: any) {
      if (values.has(this)) {
        return values.get(this);
      } else {
        let value = initializer.call(this);
        values.set(this, value);
        return value;
      }
    };
  } else {
    get = function(this: any) {
      return values.get(this);
    }
  }

  return {
    configurable: true,
    writeable: true,

    get,
    set(value: any) {
      values.set(this, value);
      Ember.notifyPropertyChange(this, key);
    }
  };
}

export function tracked(...dependencies: string[]): MethodDecorator;
export function tracked(target: any, key: any): any;
export function tracked(target: any, key: any, descriptor: PropertyDescriptor): PropertyDescriptor;
export function tracked(target: any, key: any, descriptor: PropertyDescriptor, ...dependencies: any[]): PropertyDescriptor;
export function tracked(...args: any[]): any {
  // if called for `@tracked('foo')`
  if (typeof args[0] === 'string') {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
      return tracked(target, key, descriptor, args);
    };
  } else {
    let [target, key, descriptor] = args;

    // descriptor is undefined for typescript class fields
    if (descriptor === undefined || 'initializer' in descriptor) {
      return installTrackedProperty(target, key, descriptor);
    } else {
      return descriptorForTrackedComputedProperty(target, key, descriptor, args.slice(3));
    }
  }
}
