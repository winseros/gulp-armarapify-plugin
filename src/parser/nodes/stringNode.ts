import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class StringNode extends ConstNode<string> {
    constructor(value: string) {
        super(value);
    }

    get type(): string {
        return nodeTypes.string;
    }
}