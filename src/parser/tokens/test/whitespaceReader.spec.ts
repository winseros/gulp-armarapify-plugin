import { Iterator } from '../../iterator';
import { WhitespaceReader } from '../whitespaceReader';
import { CharIterator } from '../../charIterator';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/whitespaceReader', () => {
    describe('canRead', () => {
        it('should return true for a whitespace symbols', () => {
            const reader = new WhitespaceReader();
            const iterator = {} as Iterator<string>;
            [' ', '\t'].forEach(num => {
                iterator.current = num;
                const canRead = reader.canRead(iterator);
                expect(canRead).toEqual(true);
            });
        });

        it('should return false for a non-whitespace symbols', () => {
            const reader = new WhitespaceReader();
            const iterator = {} as Iterator<string>;
            ['\r', '\n', 'a', '1'].forEach(num => {
                iterator.current = num;
                const canRead = reader.canRead(iterator);
                expect(canRead).toEqual(false);
            });
        });
    });

    describe('read', () => {
        it('should read the whitespace token', () => {
            const iterator = new CharIterator(new Buffer(' \t\t abc'));
            iterator.moveNext();

            const reader = new WhitespaceReader();
            const whitespaceToken = reader.read(iterator);
            expect(whitespaceToken).toBeDefined();

            expect(whitespaceToken.tokenType).toEqual(tokenTypes.whitespace);
            expect(whitespaceToken.tokenValue).toEqual(' ');
            expect(whitespaceToken.lineNumber).toEqual(0);
            expect(whitespaceToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });
    });
});
