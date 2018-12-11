export default class MapWithDefault<K, V> extends Map<K, V> {
  constructor(
    defaultValue: (key: K) => V,
    entries?: ReadonlyArray<[K, V]> | null
  ) {
    super(entries);
    this.defaultValue = defaultValue;
  }

  get(key: K): V {
    if (!this.has(key)) {
      this.set(key, this.defaultValue(key));
    }
    return super.get(key)!;
  }

  defaultValue: (key: K) => V;
}
