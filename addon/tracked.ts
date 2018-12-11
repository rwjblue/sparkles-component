import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';
import WeakMapWithDefault from './utils/weak-map-with-default';
import MapWithDefault from './utils/map-with-default';
import notifyPropertyChange from './utils/notify-property-change';

type Key = string | number | symbol;

const INITIALIZER = Object.freeze({
  key: Symbol('initializer'),
  kind: 'field',
  placement: 'own',
  descriptor: {
    configurable: false,
    enumerable: false,
    writable: false
  }
});

const VALUES = new WeakMap<any, any>();

type WithKeysOf<O> = { [key in keyof O]: O[key] };

function getValue<O, K extends keyof O>(obj: O, key: K): O[K] | undefined {
  return VALUES.has(obj) ? (VALUES.get(obj) as WithKeysOf<O>)[key] : undefined;
}

function setValue<O, K extends keyof O>(obj: O, key: K, value: O[K]): void {
  if (!VALUES.has(obj)) {
    VALUES.set(obj, Object.create(null));
  }
  (VALUES.get(obj) as WithKeysOf<O>)[key] = value;
}

type Field<O extends object> = [O, keyof O];
const STACK: Field<any>[] = [];

export function trackGet<O, K extends keyof O>(
  key: K,
  getter: (this: O) => O[K] | undefined = function() {
    return getValue(this, key);
  }
) {
  return function(this: O) {
    const frame: Field<O> = [this, key];
    const marker = STACK.push(frame);

    const value = getter.call(this);

    assert(
      `@tracked: stack size (${
        STACK.length
      }) is below expected size ${marker}.`,
      STACK.length >= marker
    );

    clearDependencies(frame);
    for (let dependency: Field<any>; STACK.length > marker; ) {
      dependency = STACK.pop()!;
      declareDependency(frame, dependency);
    }

    if (DEBUG) {
      const lastFrame = STACK[STACK.length - 1];
      assert(
        `@tracked: Stack frames do not match.\nExpected: '${frame}'\nReceived: ${lastFrame}`,
        frame === lastFrame
      );
    }

    return value;
  };
}

function trackSet<O, K extends keyof O>(
  key: K,
  setter: (this: O, value: O[K]) => void = function(this: O, value: O[K]) {
    setValue(this, key, value);
  }
) {
  return function(this: O, value: O[K]) {
    setter.call(this, value);
    invalidateDependentsOf([this, key]);
    notifyPropertyChange(this, key);
  };
}

const DEPENDENCIES = new WeakMapWithDefault(
  () => new MapWithDefault(() => new MapWithDefault(() => new Set<Key>()))
);

function declareDependency(from: Field<any>, on: Field<any>) {
  DEPENDENCIES.get(on[0])
    .get(on[1])
    .get(from[0])
    .add(from[1]);
}

function getDependentsOf<O extends object>([obj, key]: Field<O>): [
  any,
  ReadonlySet<Key>
][] {
  if (DEPENDENCIES.has(obj) && DEPENDENCIES.get(obj).has(key)) {
    return Array.from(DEPENDENCIES.get(obj).get(key));
  }

  return [];
}

function invalidateDependentsOf<O extends object>(field: Field<O>) {
  for (const [obj, keys] of getDependentsOf(field)) {
    for (const key of keys) {
      notifyPropertyChange(obj, key);
    }
  }
}

function clearDependencies([obj, key]: Field<any>) {
  // if (DEPENDENCIES.has(obj)) {
  //   DEPENDENCIES.get(obj).delete(key);
  // }
}

export const tracked = decoratorWithParams((desc, params: string[] = []) => {
  assert(
    '@tracked: You can only apply this decorator to class fields.',
    desc.kind === 'field' || (desc.kind === 'method' && !desc.value)
  );

  const { descriptor, key, initializer } = desc;
  const { get, set } = descriptor;

  delete desc.initializer;
  desc.kind = 'method';
  delete descriptor.writable;

  if (set) {
    assert(
      `@tracked: Marking property '${key} as tracked does not make sense, since it only has a setter.`,
      get
    );
    descriptor.set = trackSet(key, set);
  }
  if (get) {
    descriptor.get = trackGet(key, get);
    if (DEBUG && !set) {
      descriptor.set = function(value: any) {
        throw new TypeError(
          `@tracked: You cannot set the tracked property '${key}' to '${value}', because it only has a getter. Add a setter in order to set the value.`
        );
      };
    }
  }
  if (!get && !set) {
    descriptor.set = trackSet(key);
    descriptor.get = trackGet(key);
  }

  if (initializer) {
    desc.extras = [
      {
        ...INITIALIZER,
        initializer() {
          setValue(this, key, initializer.call(this));
        }
      }
    ];
  }

  return desc;
});

// @tracked
// TODO: replace return w/ PropertyDescriptor once TS gets their decorator act together
export function tracked(
  target: object,
  propertyKey: string | symbol,
  descriptor?: PropertyDescriptor
): any;
