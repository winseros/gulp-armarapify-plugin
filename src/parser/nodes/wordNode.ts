import { ConstNode } from './constNode';
import { nodeTypes } from './nodeTypes';

export class WordNode extends ConstNode<string> {
    constructor(value: string) {
        super(value);
    }

    get type(): string {
        return nodeTypes.word;
    }
}