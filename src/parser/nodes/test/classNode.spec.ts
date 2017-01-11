import { ClassNode } from '../classNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/classNode', () => {
    describe('ctor', () => {
        it('should initialize the object fields with inheritance', () => {
            const children = [new ClassNode('c1', []), new ClassNode('c2', [])];
            const node = new ClassNode('clsName', children, 'parentName');

            expect(node.className).toEqual('clsName');
            expect(node.children).toBe(children);
            expect(node.inherits).toEqual('parentName');
        });

        it('should initialize the object fields without inheritance', () => {
            const children = [new ClassNode('c1', []), new ClassNode('c2', [])];
            const node = new ClassNode('clsName', children);

            expect(node.className).toEqual('clsName');
            expect(node.children).toBe(children);
            expect(node.inherits).not.toBeDefined();
            expect(node.type).toEqual(nodeTypes.class);
        });
    });
});
