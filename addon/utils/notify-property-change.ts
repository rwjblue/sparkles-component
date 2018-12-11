import Ember from 'ember';

/**
  This function is called just after an object property has changed.
  It will notify any observers and clear caches among other things.
  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method
  manually.
  @method notifyPropertyChange
  @param {Object} obj The object with the property that will change
  @param {String} keyName The property key (or path) that will change.
*/
export default function notifyPropertyChange<O extends object>(
  obj: O,
  keyName: keyof O
): void {
  // @ts-ignore
  Ember.notifyPropertyChange(obj, keyName);
}
