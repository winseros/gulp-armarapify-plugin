import { Node } from './node';
import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class MathGrpNode extends ConstNode<Node> {
    constructor(value: Node) {
        super(value);
    }

    get type(): string {
        return nodeTypes.mathGrp;
    }
}