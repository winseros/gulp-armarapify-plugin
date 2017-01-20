import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export class MathOpNode implements Node {
    private _operator: string;
    private _left: Node;
    private _right: Node;

    constructor(operator: string, left: Node, right: Node) {
        this._operator = operator;
        this._left = left;
        this._right = right;
    }

    get operator(): string {
        return this._operator;
    }

    get left(): Node {
        return this._left;
    }

    get right(): Node {
        return this._right;
    }

    set right(value: Node) {
        this._right = value;
    }

    get type(): string {
        return nodeTypes.mathOp;
    }
}