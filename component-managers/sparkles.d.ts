/// <reference types="ember" />
import ApplicationInstance from '@ember/application/instance';
import SparklesComponent from 'sparkles-component';
export interface ComponentManagerArgs {
    named: object;
    positional: any[];
}
declare type CreateComponentResult = SparklesComponent<object> & {
    ___createComponentResult: true;
};
export default class SparklesComponentManager {
    static create(attrs: any): SparklesComponentManager;
    capabilities: any;
    constructor(owner: ApplicationInstance);
    createComponent(Klass: typeof SparklesComponent, args: ComponentManagerArgs): CreateComponentResult;
    updateComponent(component: CreateComponentResult, args: ComponentManagerArgs): void;
    destroyComponent(component: CreateComponentResult): void;
    getContext(component: CreateComponentResult): CreateComponentResult;
    didCreateComponent(component: CreateComponentResult): void;
    didUpdateComponent(component: CreateComponentResult): void;
}
export {};
