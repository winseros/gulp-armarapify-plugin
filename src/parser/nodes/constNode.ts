import { Node } from './node';

export abstract class ConstNode<T> implements Node {
    private _value: T;

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    abstract get type(): string;
}