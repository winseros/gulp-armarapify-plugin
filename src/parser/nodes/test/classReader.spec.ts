import { ClassNode } from './../classNode';
import { ClassReader } from './../classReader';

describe('parser/nodes/ClassReader', () => {
    describe('readClassNodes', () => {
        it('should read inner class nodes', () => {
            const buffer = new Buffer('class MyClass \r\n {\r\n class MyChildClass\r:MyClass2{}; class MyChildClass2:MyClass3{}; };');
            const reader = new ClassReader(buffer);
            const nodes = reader.readClassNodes();

            expect(nodes.length).toEqual(1);
            const node1 = nodes[0] as ClassNode;
            expect(node1).toBeDefined();
            expect(node1.className).toEqual('MyClass');
            expect(node1.inherits).not.toBeDefined();
            expect(node1.children.length).toEqual(2);

            const child1 = node1.children[0] as ClassNode;
            expect(child1).toBeDefined();
            expect(child1.className).toEqual('MyChildClass');
            expect(child1.inherits).toEqual('MyClass2');
            expect(child1.children.length).toEqual(0);

            const child2 = node1.children[1] as ClassNode;
            expect(child2).toBeDefined();
            expect(child2.className).toEqual('MyChildClass2');
            expect(child2.inherits).toEqual('MyClass3');
            expect(child2.children.length).toEqual(0);
        });
    });
});
