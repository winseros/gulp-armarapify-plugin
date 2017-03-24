import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { WordReader } from '../wordReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/wordReader', () => {
    describe('_canRead', () => {
        it('should return true if current iterator char is a letter', () => {
            const reader = new WordReader();
            const iterator = { current: 'a' } as Iterator<string>;
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is a digit', () => {
            const reader = new WordReader();
            const iterator = { current: '1' } as Iterator<string>;
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is a _ sign', () => {
            const reader = new WordReader();
            const iterator = { current: '_' } as Iterator<string>;
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is a $ sign', () => {
            const reader = new WordReader();
            const iterator = { current: '$' } as Iterator<string>;
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is a not allowed char', () => {
            const reader = new WordReader();
            const iterator = { current: '*' } as Iterator<string>;
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('_read', () => {
        it('should read a word', () => {
            const buffer = new Buffer('class SomeClassName');
            const iterator = new CharIterator(buffer);
            const reader = new WordReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.word);
            expect(commentToken.tokenValue).toEqual('class');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);
            expect(commentToken.index).toEqual(0);

            expect(iterator.current).toEqual(' ');
        });

        it('should read a word at the end of buffer', () => {
            const buffer = new Buffer('class');
            const iterator = new CharIterator(buffer);
            const reader = new WordReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.word);
            expect(commentToken.tokenValue).toEqual('class');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.index).toEqual(0);
        });
    });
});
