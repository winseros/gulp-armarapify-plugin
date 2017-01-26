import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class IntegerNode extends ConstNode<number> {
    constructor(value: number) {
        super(value);
    }

    get type(): string {
        return nodeTypes.integer;
    }
}