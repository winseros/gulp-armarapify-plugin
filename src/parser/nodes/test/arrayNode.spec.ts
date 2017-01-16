import { Node } from '../../nodes/node';
import { ArrayNode } from '../arrayNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/arrayNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const data = [{ type: 't1' } as Node];
            const node = new ArrayNode(data);
            expect(node.value).toBe(data);
            expect(node.type).toEqual(nodeTypes.array);
        });
    });
});
