declare class SparklesComponent<T = object> {
    args: T;
    constructor(args: T);
    didInsertElement(): void;
    didUpdate(): void;
    destroy(): void;
}
export default SparklesComponent;
export { tracked } from './tracked';
