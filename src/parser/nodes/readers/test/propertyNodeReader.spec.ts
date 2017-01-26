import { PropertyNodeReader } from '../propertyNodeReader';
import { PropertyNode } from '../../propertyNode';
import { IntegerNode } from '../../integerNode';
import { ArrayNode } from '../../arrayNode';
import { tokenTypes } from '../../../tokens/tokenTypes';
import { nodeTypes } from '../../nodeTypes';
import { ReaderUtility } from '../readerUtility';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';

describe('parser/nodes/readers/propertyNodeReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator token is a "word" and its value is not "class"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'propertyName'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new PropertyNodeReader();
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

            const reader = new PropertyNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });

        it('should return false if current iterator token is a "word" and its value is "class"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'CLaSs'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new PropertyNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read an expression node', () => {
            const str = 'prop=15;';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));
            readerUtility.moveToNextToken();

            const reader = new PropertyNodeReader();
            const node = reader.read(readerUtility);

            expect(node).toBeDefined();

            const propertyNode = node as PropertyNode;
            expect(propertyNode.type).toEqual(nodeTypes.property);
            expect(propertyNode.name).toEqual('prop');

            const numberNode = propertyNode.value as IntegerNode;
            expect(numberNode.type).toEqual(nodeTypes.integer);
            expect(numberNode.value).toEqual(15);
        });

        it('should read an array node', () => {
            const str = 'prop[]={1, 2, 3};';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));
            readerUtility.moveToNextToken();

            const reader = new PropertyNodeReader();
            const node = reader.read(readerUtility);

            expect(node).toBeDefined();

            const propertyNode = node as PropertyNode;
            expect(propertyNode.type).toEqual(nodeTypes.property);
            expect(propertyNode.name).toEqual('prop');

            const arrayNode = propertyNode.value as ArrayNode;
            expect(arrayNode.type).toEqual(nodeTypes.array);
            expect(arrayNode.value.length).toEqual(3);

            const n1 = arrayNode.value[0] as IntegerNode;
            expect(n1.type).toEqual(nodeTypes.integer);
            expect(n1.value).toEqual(1);

            const n2 = arrayNode.value[1] as IntegerNode;
            expect(n2.type).toEqual(nodeTypes.integer);
            expect(n2.value).toEqual(2);

            const n3 = arrayNode.value[2] as IntegerNode;
            expect(n3.type).toEqual(nodeTypes.integer);
            expect(n3.value).toEqual(3);
        });
    });

});
