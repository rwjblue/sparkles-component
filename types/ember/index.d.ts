declare module 'ember' {
  namespace Ember {
    // Remove once https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27661 lands
    interface _RegistryProxyMixin {
      register(fullName: string, factory: any, options?: { singleton?: boolean, instantiate?: boolean }): any;
    }
  }
  type ObserverMethod<Target, Sender> =
        | (keyof Target)
        | ((this: Target, sender: Sender, key: keyof Sender, value: any, rev: number) => void);
}
