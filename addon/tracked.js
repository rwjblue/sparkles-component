import Ember from 'ember';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
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
    assert(`You cannot use property paths with the tracked decorator, but for ${String(key)} you specified \`${(dependencies || []).join('`, `')}\`.`, (function () {
        if (dependencies === undefined)
            return true; // @tracked()
        for (let i = 0; i < dependencies.length; i++) {
            if (dependencies[i] !== undefined && dependencies[i].indexOf('.') > -1) {
                return false;
            }
        }
        return true;
    })());
    const getterProvided = desc.get;
    const setterProvided = desc.set;
    if (!getterProvided) {
        throw new Error(`@tracked - property descriptor for ${String(key)} must include a get() function`);
    }
    // will be bound to the instance when invoked
    function notify() {
        if (typeof key === 'string') {
            Ember.notifyPropertyChange(this, key);
        }
        else if (DEBUG) {
            throw new Error(`@tracked - unsupported property type ${String(key)}`);
        }
    }
    desc.get = function () {
        if (!OBSERVERS_SETUP.has(this) && Array.isArray(dependencies)) {
            setupObservers(this, dependencies, notify);
        }
        OBSERVERS_SETUP.set(this, true);
        return getterProvided.call(this);
    };
    if (setterProvided) {
        desc.set = function (value) {
            if (typeof key === 'string') {
                Ember.notifyPropertyChange(this, key);
                setterProvided.call(this, value);
            }
            else if (DEBUG) {
                throw new Error(`@tracked - unsupported property type ${String(key)}`);
            }
        };
    }
    return desc;
}
function installTrackedProperty(_target, key, descriptor) {
    // only happens in babel, never in TS (Sept 2018)
    // TODO check for whether initializer is a function
    const initializer = descriptor && descriptor.initializer;
    let values = new WeakMap();
    let get;
    if (typeof initializer === 'function') {
        get = function () {
            if (values.has(this)) {
                return values.get(this);
            }
            else {
                let value = initializer.call(this);
                values.set(this, value);
                return value;
            }
        };
    }
    else {
        get = function () {
            return values.get(this);
        };
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
            }
            else if (DEBUG) {
                throw new Error(`@tracked - unsupported property type ${String(key)}`);
            }
        }
    };
}
function _tracked(target, key, descriptor, dependencies) {
    // descriptor is undefined for typescript class fields
    if (descriptor === undefined || 'initializer' in descriptor) {
        return installTrackedProperty(target, key, descriptor);
    }
    else {
        return descriptorForTrackedComputedProperty(target, key, descriptor, dependencies);
    }
}
// TODO: replace return w/ CompatiblePropertyDecorator | PropertyDescriptor
export function tracked(targetOrArgs, secondArg, descriptorOrString, ...rest) {
    // if called for `@tracked('foo')`
    if (typeof targetOrArgs === 'string') { //  @tracked('foo', 'bar')
        const args = [targetOrArgs, secondArg, descriptorOrString, ...rest];
        return function (target, key, descriptor) {
            return _tracked(target, key, descriptor, args);
        };
    }
    else { // @tracked
        return _tracked(targetOrArgs, secondArg, descriptorOrString);
    }
}
