import { ConstNode } from '../constNode';

class MockNode extends ConstNode<number>{
    constructor(value: number) {
        super(value);
    }

    get type(): string {
        return 'nothing';
    }
}

describe('parser/nodes/constNode', () => {
    describe('ctor', () => {
        it('should initialize the object fields', () => {
            const node = new MockNode(100500);

            expect(node.value).toEqual(100500);
            expect(node.type).toBeDefined(/*just for the coverage*/);
        });
    });
});
