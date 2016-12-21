import { DataNode } from './dataNode';

export class ValueNode extends DataNode<string | number> {
    constructor(name: string, value: string | number) {
        super(name, value);
    }
}