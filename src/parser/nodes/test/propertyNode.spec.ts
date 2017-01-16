import { Node } from '../../nodes/node';
import { PropertyNode } from '../propertyNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/propertyNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const data = { type: 't1' } as Node;
            const node = new PropertyNode('property-name', data);
            expect(node.name).toEqual('property-name');
            expect(node.value).toBe(data);
            expect(node.type).toEqual(nodeTypes.property);
        });
    });
});
