import Ember from 'ember';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { addObserver } from '@ember/object/observers';

function setupObservers(instance: object, dependentKeys: string[], notifyMethod: (() => void)) {
  for (let i = 0; i < dependentKeys.length; i++) {
    let dependentKey = dependentKeys[i];
    addObserver(instance, dependentKey, instance, notifyMethod);
  }
}

function descriptorForTrackedComputedProperty(_target: any, key: string | symbol, desc: PropertyDescriptor, dependencies?: string[]) {
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
      Ember.notifyPropertyChange(this, key);
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
        Ember.notifyPropertyChange(this, key);
        setterProvided.call(this, value);
      } else if (DEBUG) {
        throw new Error(`@tracked - unsupported property type ${String(key)}`);
      }
    };
  }

  return desc;
}

function installTrackedProperty(_target: object, key: string | symbol, descriptor?: PropertyDescriptor & { initializer: (() => void)}): PropertyDescriptor {
  // only happens in babel, never in TS (Sept 2018)
  // TODO check for whether initializer is a function
  const initializer = descriptor && descriptor.initializer;

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
    configurable: true,
    // TODO: correcting a misspelling caused chrome to error
    // writable: true,

    get,
    set(value) {
      if (typeof key === 'string') {
        values.set(this, value);
        Ember.notifyPropertyChange(this, key);
      } else if (DEBUG) {
        throw new Error(`@tracked - unsupported property type ${String(key)}`);
      }
    }
  };
}


function _tracked(target: object, key: string | symbol, descriptor?: PropertyDescriptor, dependencies?: string[]): any {
  let desc: PropertyDescriptor;
  // descriptor is undefined for typescript class fields
  if (descriptor === undefined || 'initializer' in descriptor) {
    desc = installTrackedProperty(target, key, descriptor);
  } else {
    desc = descriptorForTrackedComputedProperty(target, key, descriptor, dependencies);
  }

  return {
    kind: 'method',
    placement: 'prototype',
    key,
    descriptor: desc
  };
}

// type CompatiblePropertyDecorator = (target: object, key: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;

// @tracked
// TODO: replace return w/ PropertyDescriptor once TS gets their decorator act together
export function tracked(target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): any;
// @tracked('foo', 'bar')
// TODO: replace return w/ CompatiblePropertyDecorator
export function tracked(...args: string[]): any;
// TODO: replace return w/ CompatiblePropertyDecorator | PropertyDescriptor
export function tracked(
  targetOrArgs: (string | object),
  secondArg: string | symbol,
  descriptorOrString: string | PropertyDescriptor | undefined,
  ...rest: string[]): any
  {
  // if called for `@tracked('foo')`
  if (typeof targetOrArgs === 'string') { //  @tracked('foo', 'bar')
    const args =  [targetOrArgs, secondArg as string, descriptorOrString as string, ...rest];
    return function(target: object, key: string | symbol, descriptor: PropertyDescriptor) {
      return _tracked(target, key, descriptor, args);
    }
  } else { // @tracked
    return _tracked(targetOrArgs, secondArg, descriptorOrString as PropertyDescriptor | undefined);
  }
}
