import { Node } from './node';
import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class MathNegNode extends ConstNode<Node> {
    constructor(value: Node) {
        super(value);
    }

    get type(): string {
        return nodeTypes.mathNeg;
    }
}