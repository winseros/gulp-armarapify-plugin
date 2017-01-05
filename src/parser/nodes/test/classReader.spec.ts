import { ValueNode } from './../valueNode';
import { ArrayNode } from './../arrayNode';
import { ClassNode } from './../classNode';
import { ClassReader } from './../classReader';

xdescribe('parser/nodes/ClassReader', () => {
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

        it('should read class with properties', () => {
            const buffer = new Buffer('class MyClass{prop1=1.0;\r\nprop2\r="p2"; \r\n prop3[]={1,2,3,4,5};};');
            const reader = new ClassReader(buffer);
            const nodes = reader.readClassNodes();

            expect(nodes.length).toEqual(1);
            const node1 = nodes[0] as ClassNode;
            expect(node1).toBeDefined();
            expect(node1.className).toEqual('MyClass');
            expect(node1.inherits).not.toBeDefined();
            expect(node1.children.length).toEqual(3);

            const prop1 = node1.children[0] as ValueNode;
            expect(prop1).toBeDefined();
            expect(prop1.name).toEqual('prop1');
            expect(prop1.value).toEqual(1.0);

            const prop2 = node1.children[1] as ValueNode;
            expect(prop2).toBeDefined();
            expect(prop2.name).toEqual('prop2');
            expect(prop2.value).toEqual('p2');

            const prop3 = node1.children[2] as ArrayNode;
            expect(prop3).toBeDefined();
            expect(prop3.name).toEqual('prop3');
            expect(prop3.value).toEqual([1, 2, 3, 4, 5]);
        });

        it('should throw if can not read class signature', () => {
            const buffer = new Buffer(';');
            const reader = new ClassReader(buffer);
            expect(() => reader.readClassNodes()).toThrowError('Token ";" is not expected');
        });
    });
});