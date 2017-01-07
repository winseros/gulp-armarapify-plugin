import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class NumberNode extends ConstNode<number> {
    constructor(value: number) {
        super(value);
    }

    get type(): string {
        return nodeTypes.number;
    }
}