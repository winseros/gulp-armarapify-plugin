import { Node } from './node';

export abstract class DataNode<T> implements Node {
    private _name: string;
    private _value: T;

    constructor(name: string, value: T) {
        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name;
    }

    get value(): T {
        return this._value;
    }
}