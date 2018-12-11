import ComputedProperty from '@ember/object/computed';
import { trackGet } from 'sparkles-component/tracked';

export function initialize() {
  // Hooks into the getter method of the `ComputedProperty` base class to
  // instrument it for tracking access to `@tracked` properties.
  const _get = ComputedProperty.prototype.get;
  ComputedProperty.prototype.get = function(obj: object, key: string) {
    return trackGet<any, string>(key, () => _get.apply(this, arguments)).call(
      obj
    );
  };
}

export default {
  initialize
};
