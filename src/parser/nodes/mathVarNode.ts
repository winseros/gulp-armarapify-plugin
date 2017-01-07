import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export class MathVarNode implements Node {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get type(): string {
        return nodeTypes.mathVar;
    }
}