import { ExpressionNodeReader } from '../expressionNodeReader';
import { tokenTypes } from '../../../tokens/tokenTypes';
import { ReaderUtility } from '../readerUtility';
import { StringNode } from '../../stringNode';
import { ExpressionReader } from '../expressionReader';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';

describe('parser/nodes/readers/expressionNodeReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator token is "="', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.equals
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ExpressionNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(true);
        });

        it('should return false if current iterator token is not "="', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.comment
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new ExpressionNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should call the internal methods', () => {
            const str = '="a";';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));

            const n1 = new StringNode('a');
            spyOn(ExpressionReader.prototype, 'readExpression').and.returnValue(n1);

            const reader = new ExpressionNodeReader();
            const node = reader.read(readerUtility);

            expect(node).toBeDefined();
            expect(node).toBe(n1);
        });
    });
});
