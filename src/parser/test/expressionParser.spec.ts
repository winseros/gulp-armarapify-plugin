import { nodeTypes } from '../nodes/nodeTypes';
import { StringNode } from '../nodes/stringNode';
import { ExpressionParser } from '../expressionParser';

describe('parser/expressionParser', () => {
    describe('parseExpression', () => {
        it('should parse a string expression', () => {
            const parser = new ExpressionParser();
            const node = parser.parseExpression(Buffer.from('abc')) as StringNode;

            expect(node.type).toEqual(nodeTypes.word);
            expect(node.value).toEqual('abc');
        });

        it('should throw if can not parse expression', () => {
            const parser = new ExpressionParser();
            expect(() => parser.parseExpression(Buffer.from('   '))).toThrow();
        });
    });
});