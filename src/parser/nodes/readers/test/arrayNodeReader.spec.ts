import { ArrayNodeReader } from '../arrayNodeReader';
import { tokenTypes } from '../../../tokens/tokenTypes';
import { ReaderUtility } from '../readerUtility';
import { nodeTypes } from '../../nodeTypes';
import { StringNode } from '../../stringNode';
import { NumberNode } from '../../numberNode';
import { ArrayNode } from '../../arrayNode';
import { ExpressionReader } from '../expressionReader';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';

describe('parser/nodes/readers/arrayNodeReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator token is "["', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.squareBracketOpen
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ArrayNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(true);
        });

        it('should return false if current iterator token is not "["', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.comment
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ArrayNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read an array', () => {
            const str = ']\n=\n{\n"a", 1, {"b", \n 2}\n};';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));

            const n1 = new StringNode('a');
            const n2 = new NumberNode(1);
            const n3 = new StringNode('b');
            const n4 = new NumberNode(2);
            spyOn(ExpressionReader.prototype, 'readExpression').and.returnValues(n1, n2, n3, n4);

            const reader = new ArrayNodeReader();
            const arrayNode = reader.read(readerUtility) as ArrayNode;

            //main array
            expect(arrayNode).toBeDefined();
            expect(arrayNode.type).toEqual(nodeTypes.array);
            expect(arrayNode.value.length).toEqual(3);

            //main array elements 0 and 1
            expect(arrayNode.value[0]).toBe(n1);
            expect(arrayNode.value[1]).toBe(n2);

            //array element 2 - embedded array
            const embedArray = arrayNode.value[2] as ArrayNode;
            expect(embedArray).toBeDefined();
            expect(embedArray.type).toEqual(nodeTypes.array);
            expect(embedArray.value.length).toEqual(2);

            //embedded array elements 0 and 1
            expect(embedArray.value[0]).toBe(n3);
            expect(embedArray.value[1]).toBe(n4);
        });
    });

});
