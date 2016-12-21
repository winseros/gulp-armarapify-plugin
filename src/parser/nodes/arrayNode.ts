import { DataNode } from './dataNode';

export class ArrayNode extends DataNode<Array<string | number>> {
    constructor(name: string, value: Array<string | number>) {
        super(name, value);
    }
}