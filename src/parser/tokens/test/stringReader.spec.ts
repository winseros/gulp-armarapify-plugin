import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { StringReader } from '../stringReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/stringReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator char is a quote', () => {
            const reader = new StringReader();
            const iterator = { current: '"' } as Iterator<string>;
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is not a quote', () => {
            const reader = new StringReader();
            const iterator = { current: 'a' } as Iterator<string>;
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read a string', () => {
            const buffer = new Buffer('"some-string-text";');
            const iterator = new CharIterator(buffer);
            const reader = new StringReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.string);
            expect(commentToken.tokenValue).toEqual('some-string-text');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual(';');
        });

        it('should read a string with inner quotes', () => {
            const buffer = new Buffer('"some-string-text ""with inner quotes"" ";');
            const iterator = new CharIterator(buffer);
            const reader = new StringReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.string);
            expect(commentToken.tokenValue).toEqual('some-string-text ""with inner quotes"" ";');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual(';');
        });

        it('should throw if a string contains CR symbol', () => {
            const buffer = new Buffer('"some-string-value\rmultiline"');
            const iterator = new CharIterator(buffer);
            const reader = new StringReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Strings can not wrap on a new line');
        });

        it('should throw if a string contains LF symbol', () => {
            const buffer = new Buffer('"some-string-value\nmultiline"');
            const iterator = new CharIterator(buffer);
            const reader = new StringReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Strings can not wrap on a new line');
        });

        it('should throw if a string is missing an ending quote', () => {
            const buffer = new Buffer('"some-string-value');
            const iterator = new CharIterator(buffer);
            const reader = new StringReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('A string should end with a " sign');
        });
    });
});
