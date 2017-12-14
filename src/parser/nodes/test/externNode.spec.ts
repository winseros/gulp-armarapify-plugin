import { ExternNode } from '../externNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/externNode', () => {
    describe('ctor', () => {
        it('should initialize the object fields', () => {
            const node = new ExternNode('clsName');

            expect(node.className).toEqual('clsName');
            expect(node.type).toEqual(nodeTypes.extern);
        });
    });
});
