declare module '@ember/object/computed' {
  export default class ComputedProperty {
    get(obj: object, key: string): any;
  }
}
