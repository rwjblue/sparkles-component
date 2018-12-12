import Ember from 'ember';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { addObserver } from '@ember/object/observers';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';

// @ts-ignore
const notifyPropertyChange: (target: object, key: string) => void = Ember.notifyPropertyChange;

function setupObservers(instance: object, dependentKeys: string[], notifyMethod: (() => void)) {
  for (let i = 0; i < dependentKeys.length; i++) {
    let dependentKey = dependentKeys[i];
    addObserver(instance, dependentKey, instance, notifyMethod);
  }
}

function descriptorForTrackedComputedProperty(key: string | symbol, desc: PropertyDescriptor, dependencies?: string[]) {
  // TODO: really should use WeakSet here, but that isn't available on IE11
  const OBSERVERS_SETUP = new WeakMap();

  assert(
    `You cannot use property paths with the tracked decorator, but for ${String(key)} you specified \`${(dependencies || []).join('`, `')}\`.`,
    (function() {
      if (dependencies === undefined) return true; // @tracked()
      for (let i = 0; i < dependencies.length; i++) {
        if (dependencies[i] !== undefined && dependencies[i].indexOf('.') > -1) {
          return false;
        }
      }

      return true;
    })()
  );
  const getterProvided = desc.get;
  const setterProvided = desc.set;
  if (!getterProvided) {
    throw new Error(`@tracked - property descriptor for ${String(key)} must include a get() function`);
  }

  // will be bound to the instance when invoked
  function notify(this: object) {
    if (typeof key === 'string') {
      notifyPropertyChange(this, key);
    } else if (DEBUG) {
      throw new Error(`@tracked - unsupported property type ${String(key)}`);
    }
  }

  desc.get = function() {
    if (!OBSERVERS_SETUP.has(this) && Array.isArray(dependencies)) {
      setupObservers(this, dependencies, notify);
    }
    OBSERVERS_SETUP.set(this, true);

    return getterProvided.call(this);
  };

  if (setterProvided) {
    desc.set = function(value) {
      if (typeof key === 'string') {
        notifyPropertyChange(this, key);
        setterProvided.call(this, value);
      } else if (DEBUG) {
        throw new Error(`@tracked - unsupported property type ${String(key)}`);
      }
    };
  }

  return desc;
}

function installTrackedProperty(key: string | symbol, descriptor?: PropertyDescriptor, initializer?: () => any): PropertyDescriptor {
  let values = new WeakMap();

  let get;
  if (typeof initializer === 'function') {
    get = function(this: object) {
      if (values.has(this)) {
        return values.get(this);
      } else {
        let value = initializer.call(this);
        values.set(this, value);
        return value;
      }
    };
  } else {
    get = function(this: object) {
      return values.get(this);
    }
  }

  return {
    configurable: descriptor ? descriptor.configurable : true,
    enumerable: descriptor ? descriptor.enumerable : true,
    get,
    set(value) {
      if (typeof key === 'string') {
        values.set(this, value);
        notifyPropertyChange(this, key);
      } else if (DEBUG) {
        throw new Error(`@tracked - unsupported property type ${String(key)}`);
      }
    }
  };
}


function _tracked(
  key: string | symbol,
  descriptor?: PropertyDescriptor,
  initializer?: () => any,
  dependencies?: string[]
): PropertyDescriptor {
  if (!descriptor || typeof descriptor.get !== 'function' && typeof descriptor.set !== 'function') {
    return installTrackedProperty(key, descriptor, initializer);
  } else {
    return descriptorForTrackedComputedProperty(key, descriptor, dependencies);
  }
}

// TODO: replace return w/ PropertyDescriptor once TS gets their decorator act together
type TSDecorator = (target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => any;
type TrackedDecorator = TSDecorator & ((...args: string[]) => TSDecorator);

export const tracked: TrackedDecorator = decoratorWithParams((desc, params = []) => {
  assert(`@tracked - Can only be used on class fields.`, desc.kind === 'field' || desc.kind === 'method');
  const descriptor = _tracked(desc.key, desc.descriptor, desc.initializer, params);

  return {
    ...desc,
    descriptor,
    kind: 'method',
    initializer: undefined
  };
});