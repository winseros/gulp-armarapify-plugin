import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { WordReader } from '../wordReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/wordReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator char is a letter', () => {
            const reader = new WordReader();
            const iterator = { current: 'a' } as Iterator<string>;
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is a _ sign', () => {
            const reader = new WordReader();
            const iterator = { current: '_' } as Iterator<string>;
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true if current iterator char is a non-letter', () => {
            const reader = new WordReader();
            const iterator = { current: '1' } as Iterator<string>;
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read a word', () => {
            const buffer = new Buffer('class SomeClassName');
            const iterator = new CharIterator(buffer);
            const reader = new WordReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.word);
            expect(commentToken.tokenValue).toEqual('class');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual(' ');
        });

        it('should read a word at the end of buffer', () => {
            const buffer = new Buffer('class');
            const iterator = new CharIterator(buffer);
            const reader = new WordReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.word);
            expect(commentToken.tokenValue).toEqual('class');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);
        });
    });
});
