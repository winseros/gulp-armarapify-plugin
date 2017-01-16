import { StringNode } from '../stringNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/stringNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const node = new StringNode('n-value');
            expect(node.value).toEqual('n-value');
            expect(node.type).toEqual(nodeTypes.string);
        });
    });
});
