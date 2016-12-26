import { DataNode } from '../dataNode';

class MockNode extends DataNode<number>{
    constructor(name: string, value: number) {
        super(name, value);
    }
}

describe('parser/nodes/dataNode', () => {
    describe('ctor', () => {
        it('should initialize the object fields', () => {
            const node = new MockNode('nodeName', 100500);

            expect(node.name).toEqual('nodeName');
            expect(node.value).toEqual(100500);
        });
    });
});
