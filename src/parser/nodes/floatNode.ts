import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class FloatNode extends ConstNode<number> {
    constructor(value: number) {
        super(value);
    }

    get type(): string {
        return nodeTypes.float;
    }
}