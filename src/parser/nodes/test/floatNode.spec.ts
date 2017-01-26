import { FloatNode } from '../floatNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/floatNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const node = new FloatNode(100500);
            expect(node.value).toEqual(100500);
            expect(node.type).toEqual(nodeTypes.float);
        });
    });
});
