import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class NumberNode extends ConstNode<number> {
    private _isFloat: boolean;

    constructor(value: number, isFloat: boolean) {
        super(value);
        this._isFloat = isFloat;
    }

    get type(): string {
        return nodeTypes.number;
    }

    get isFloat(): boolean {
        return this._isFloat;
    }
}