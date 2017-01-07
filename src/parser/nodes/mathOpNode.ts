import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export const mathOperators = {
    '+': 'math-plus',
    '-': 'math-minus',
    '*': 'math-mul',
    '/': 'math-div',
    '%': 'math-mod',
    '^': 'math-pow'
};

export class MathOpNode implements Node {
    private _operator: string;
    private _left: Node;
    private _right: Node | undefined;

    constructor(operator: string, left: Node, right?: Node) {
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

    get right(): Node | undefined {
        return this._right;
    }

    get type(): string {
        return nodeTypes.mathOp;
    }
}