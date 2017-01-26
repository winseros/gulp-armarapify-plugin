import { FileReader } from '../fileReader';
import { nodeTypes } from '../../nodeTypes';
import { ReaderUtility } from '../readerUtility';
import { TokenIterator } from '../../../tokenIterator';
import { ClassNode } from '../../classNode';
import { PropertyNode } from '../../propertyNode';
import { StringNode } from '../../stringNode';
import { IntegerNode } from '../../integerNode';
import { MathOpNode } from '../../mathOpNode';
import { mathOperators } from '../../../../mathOperators';

describe('parser/nodes/readers/fileReader', () => {
    describe('read', () => {
        it('should read nodes', () => {
            const str = '\r\n prop1="value"; prop2=100500; \r\n class MyClsInner{ prop3=1/2; \r\n};';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));
            readerUtility.moveToNextToken();

            const reader = new FileReader('MyFile.txt');
            const node = reader.read(readerUtility) as ClassNode;

            expect(node.type).toEqual(nodeTypes.class);
            expect(node.className).toEqual('MyFile.txt');
            expect(node.inherits).toEqual('');

            expect(node.children.length).toEqual(3);

            const child1 = node.children[0] as PropertyNode;
            expect(child1.name).toEqual('prop1');
            expect(child1.type).toEqual(nodeTypes.property);
            expect((child1.value as StringNode).value).toEqual('value');

            const child2 = node.children[1] as PropertyNode;
            expect(child2.name).toEqual('prop2');
            expect(child2.type).toEqual(nodeTypes.property);
            expect((child2.value as IntegerNode).value).toEqual(100500);

            const child3 = node.children[2] as ClassNode;
            expect(child3.className).toEqual('MyClsInner');
            expect(child3.type).toEqual(nodeTypes.class);
            expect(child3.children.length).toEqual(1);

            const child31 = child3.children[0] as PropertyNode;
            expect(child31.type).toEqual(nodeTypes.property);
            expect(child31.name).toEqual('prop3');

            const child31v = child31.value as MathOpNode;
            expect(child31v.type).toEqual(nodeTypes.mathOp);
            expect(child31v.operator).toEqual(mathOperators.div);

            const child31Left = child31v.left as IntegerNode;
            expect(child31Left.type).toEqual(nodeTypes.integer);
            expect(child31Left.value).toEqual(1);

            const child31right = child31v.right as IntegerNode;
            expect(child31right.type).toEqual(nodeTypes.integer);
            expect(child31right.value).toEqual(2);
        });
    });
});
