declare module 'ember' {
  namespace Ember {
    // Remove once https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27661 lands
    interface _RegistryProxyMixin {
      register(fullName: string, factory: any, options?: { singleton?: boolean, instantiate?: boolean }): any;
    }
    function _setComponentManager<T>(managerId: string, baseClass: T): T;
    function _componentManagerCapabilities(version: string, opts?: {
      destructor?: boolean;
      asyncLifecycleCallbacks?: boolean;
    }): any;

    function notifyPropertyChange(target: object, key: string): void;
    function addObserver<T>(target: T, dependentKey: string, instance: any, notifyMethod: () => void): T;

  }
}
