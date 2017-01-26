import { IntegerNode } from '../integerNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/integerNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const node = new IntegerNode(100500);
            expect(node.value).toEqual(100500);
            expect(node.type).toEqual(nodeTypes.integer);
        });
    });
});
