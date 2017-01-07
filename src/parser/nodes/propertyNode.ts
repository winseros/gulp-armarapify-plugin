import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export class PropertyNode implements Node {
    private _name: string;
    private _value: Node;

    constructor(name: string, value: Node) {
        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name;
    }

    get value(): Node {
        return this._value;
    }

    get type(): string {
        return nodeTypes.property;
    }
}