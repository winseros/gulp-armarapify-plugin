import { Node } from './node';

export abstract class ValueNode implements Node {
    private _name: string;
    private _value: string | number;

    constructor(name: string, value: string | number) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get value(): string | number {
        return this._value;
    }
}