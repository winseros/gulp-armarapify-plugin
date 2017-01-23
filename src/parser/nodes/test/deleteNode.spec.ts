import { DeleteNode } from '../deleteNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/deleteNode', () => {
    describe('ctor', () => {
        it('should initialize the object fields', () => {
            const node = new DeleteNode('clsName');

            expect(node.className).toEqual('clsName');;
            expect(node.type).toEqual(nodeTypes.delete);
        });
    });
});
