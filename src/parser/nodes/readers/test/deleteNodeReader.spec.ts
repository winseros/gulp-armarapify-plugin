import { DeleteNodeReader } from '../deleteNodeReader';
import { tokenTypes } from '../../../tokens/tokenTypes';
import { nodeTypes } from '../../nodeTypes';
import { ReaderUtility } from '../readerUtility';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';
import { DeleteNode } from '../../deleteNode';

describe('parser/nodes/readers/deleteNodeReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator token is a "word" and its value is "delete"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'DeLeTe'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new DeleteNodeReader();
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

            const reader = new DeleteNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });

        it('should return false if current iterator token is a "word" and its value is not "delete"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'property'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new DeleteNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read a class delete', () => {
            const str = 'delete AClass;';
            const readerUtility = new ReaderUtility(new TokenIterator(new Buffer(str)));
            readerUtility.moveToNextToken();

            const reader = new DeleteNodeReader();
            const node = reader.read(readerUtility) as DeleteNode;

            expect(node.type).toEqual(nodeTypes.delete);
            expect(node.className).toEqual('AClass');
        });
    });
});
