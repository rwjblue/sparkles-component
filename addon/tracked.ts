import Ember from 'ember';
import { assert } from '@ember/debug';
import { addObserver } from '@ember/object/observers';

function setupObservers(instance, dependentKeys, notifyMethod) {
  for (let i = 0; i < dependentKeys.length; i++) {
    let dependentKey = dependentKeys[i];
    addObserver(instance, dependentKey, instance, notifyMethod);
  }
}

function descriptorForTrackedComputedProperty(_target, key, desc, dependencies) {
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
  let getterProvided = desc.get;
  let setterProvided = desc.set;

  // will be bound to the instance when invoked
  function notify(this: object) {
    Ember.notifyPropertyChange(this, key);
  }

  desc.get = function() {
    if (!OBSERVERS_SETUP.has(this)) {
      setupObservers(this, dependencies, notify);
      OBSERVERS_SETUP.set(this, true);
    }

    return getterProvided.call(this);
  };

  if (setterProvided) {
    desc.set = function(value) {
      Ember.notifyPropertyChange(this, key);

      setterProvided.call(this, value);
    };
  }

  return desc;
}

function installTrackedProperty(_target, key, descriptor) {
  let initializer = descriptor && descriptor.initializer;
  let values = new WeakMap();

  let get;
  if (initializer) {
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
    writeable: true,

    get,
    set(value) {
      values.set(this, value);
      Ember.notifyPropertyChange(this, key);
    }
  };
}

export function tracked(...args) {
  // if called for `@tracked('foo')`
  if (typeof args[0] === 'string') {
    return function(target, key, descriptor) {
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
