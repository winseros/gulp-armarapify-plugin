import { ClassNodeReader } from '../classNodeReader';
import { tokenTypes } from '../../../tokens/tokenTypes';
import { nodeTypes } from '../../nodeTypes';
import { ReaderUtility } from '../readerUtility';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';
import { ClassNode } from '../../classNode';
import { PropertyNode } from '../../propertyNode';
import { StringNode } from '../../stringNode';
import { NumberNode } from '../../numberNode';

describe('parser/nodes/readers/classNodeReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator token is a "word" and its value is "class"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'ClAsS'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ClassNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(true);
        });

        it('should return false if current iterator token is not a "word"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.equals,
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ClassNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });

        it('should return false if current iterator token is a "word" and its value is not "class"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'property'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ClassNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read a class without inheritance', () => {
            const str = 'class MyClass \r\n { \r\n prop1="value"; prop2=100500; \r\n class MyClsInner{ prop3=1; \r\n}; };';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));
            readerUtility.moveToNextToken();

            const reader = new ClassNodeReader();
            const node = reader.read(readerUtility) as ClassNode;

            expect(node.type).toEqual(nodeTypes.class);
            expect(node.className).toEqual('MyClass');
            expect(node.inherits).toEqual('');

            expect(node.children.length).toEqual(3);

            const child1 = node.children[0] as PropertyNode;
            expect(child1.name).toEqual('prop1');
            expect(child1.type).toEqual(nodeTypes.property);
            expect((child1.value as StringNode).value).toEqual('value');

            const child2 = node.children[1] as PropertyNode;
            expect(child2.name).toEqual('prop2');
            expect(child2.type).toEqual(nodeTypes.property);
            expect((child2.value as NumberNode).value).toEqual(100500);

            const child3 = node.children[2] as ClassNode;
            expect(child3.className).toEqual('MyClsInner');
            expect(child3.type).toEqual(nodeTypes.class);
            expect(child3.children.length).toEqual(1);
        });

        it('should read a class with inheritance', () => {
            const str = 'class MyClass \r\n:\r\nMyClass2 \r\n { \r\n prop1="value"; \r\n class MyClsInner{ prop3=1; \r\n}; prop2=100500; };';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));
            readerUtility.moveToNextToken();

            const reader = new ClassNodeReader();
            const node = reader.read(readerUtility) as ClassNode;

            expect(node.type).toEqual(nodeTypes.class);
            expect(node.className).toEqual('MyClass');
            expect(node.inherits).toEqual('MyClass2');

            expect(node.children.length).toEqual(3);

            const child1 = node.children[0] as PropertyNode;
            expect(child1.name).toEqual('prop1');
            expect(child1.type).toEqual(nodeTypes.property);
            expect((child1.value as StringNode).value).toEqual('value');

            const child2 = node.children[1] as ClassNode;
            expect(child2.className).toEqual('MyClsInner');
            expect(child2.type).toEqual(nodeTypes.class);
            expect(child2.children.length).toEqual(1);

            const child3 = node.children[2] as PropertyNode;
            expect(child3.name).toEqual('prop2');
            expect(child3.type).toEqual(nodeTypes.property);
            expect((child3.value as NumberNode).value).toEqual(100500);
        });
    });
});
