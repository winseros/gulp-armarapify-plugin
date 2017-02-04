import { Iterator } from '../../iterator';
import { NewLineReader } from '../newLineReader';
import { CharIterator } from '../../charIterator';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/newLineReader', () => {
    describe('_canRead', () => {
        it('should return true for a CR and LF symbols', () => {
            const reader = new NewLineReader();
            const iterator = {} as Iterator<string>;
            ['\r', '\n'].forEach(num => {
                iterator.current = num;
                const canRead = reader._canRead(iterator);
                expect(canRead).toEqual(true);
            });
        });

        it('should return false for a non CR and LF symbols', () => {
            const reader = new NewLineReader();
            const iterator = {} as Iterator<string>;
            [' ', '\t', 'a', '1'].forEach(num => {
                iterator.current = num;
                const canRead = reader._canRead(iterator);
                expect(canRead).toEqual(false);
            });
        });
    });

    describe('_read', () => {
        it('should read the CRLF tokens', () => {
            [
                { str: '\rabc', exp: 'a' },
                { str: '\r\rabc', exp: '\r' },
                { str: '\nabc', exp: '\a' },
                { str: '\n\nabc', exp: '\n' },
                { str: '\r\nabc', exp: '\a' },
                { str: '\n\rabc', exp: '\r' }
            ].forEach(p => {
                const iterator = new CharIterator(new Buffer(p.str));
                iterator.moveNext();

                const reader = new NewLineReader();
                const newLineToken = reader._read(iterator);
                expect(newLineToken).toBeDefined();

                expect(newLineToken.tokenType).toEqual(tokenTypes.newline);
                expect(newLineToken.tokenValue).toEqual('\r\n');
                expect(newLineToken.lineNumber).toEqual(0);
                expect(newLineToken.colNumber).toEqual(0);

                expect(iterator.current).toEqual(p.exp);
            });
        });

        it('should throw if iterator.current is not CR or LF symbol', () => {
            const iterator = new CharIterator(new Buffer('a'));
            iterator.moveNext();
            const reader = new NewLineReader();
            expect(() => reader._read(iterator)).toThrowError('Expected CR or LF bymbol but got "a", code: 97');
        });
    });
});
