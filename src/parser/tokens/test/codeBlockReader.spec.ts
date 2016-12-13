import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { CodeBlockReader } from '../codeBlockReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/codeBlockReader', () => {

    describe('canRead', () => {
        it('should return true for the code block start', () => {
            const iterator = { current: '{' } as Iterator<string>;
            const reader = new CodeBlockReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the code block end', () => {
            const iterator = { current: '}' } as Iterator<string>;
            const reader = new CodeBlockReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the any other symbol', () => {
            const iterator = { current: '1' } as Iterator<string>;
            const reader = new CodeBlockReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read the start of the code block', () => {
            const buffer = new Buffer('{abcd');
            const iterator = new CharIterator(buffer);
            const reader = new CodeBlockReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.codeBlockStart);
            expect(codeBlockToken.tokenValue).toEqual('{');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the end of the code block', () => {
            const buffer = new Buffer('}abcd');
            const iterator = new CharIterator(buffer);
            const reader = new CodeBlockReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.codeBlockEnd);
            expect(codeBlockToken.tokenValue).toEqual('}');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should throw if there is a wrong symbol in the iterator', () => {
            const buffer = new Buffer('a');
            const iterator = new CharIterator(buffer);
            const reader = new CodeBlockReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Expected a "{" or "}" but got a "a"');
        });
    });
});
