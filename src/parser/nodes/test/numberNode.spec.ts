import { NumberNode } from '../numberNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/numberNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const node = new NumberNode(100500, 'isFloat' as any);
            expect(node.value).toEqual(100500);
            expect(node.type).toEqual(nodeTypes.number);
            expect(node.isFloat).toEqual('isFloat');
        });
    });
});
