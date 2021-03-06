import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { ControlCharReader } from '../controlCharReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/controlCharReader', () => {

    describe('_canRead', () => {
        it('should recognize a special character', () => {

            const characters = ['{', '}', ';', ',', ':', '=', '(', ')', '[', ']', '+', '-', '*', '/', '%', '^'];

            const iterator = {} as Iterator<string>;
            const reader = new ControlCharReader();
            characters.forEach((key: string) => {
                iterator.current = key;
                const canRead = reader._canRead(iterator);
                expect(canRead).toEqual(true);
            });
        });

        it('should return false for the any other symbol', () => {
            const iterator = { current: '1' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('_read', () => {
        it('should read a special character char', () => {
            const characters = {
                '{': tokenTypes.codeBlockStart,
                '}': tokenTypes.codeBlockEnd,
                ';': tokenTypes.semicolon,
                ',': tokenTypes.comma,
                ':': tokenTypes.colon,
                '=': tokenTypes.equals,
                '(': tokenTypes.bracketOpen,
                ')': tokenTypes.bracketClose,
                '[': tokenTypes.squareBracketOpen,
                ']': tokenTypes.squareBracketClose,
                '+': tokenTypes.mathOp,
                '-': tokenTypes.mathOp,
                '*': tokenTypes.mathOp,
                '/': tokenTypes.mathOp,
                '%': tokenTypes.mathOp,
                '^': tokenTypes.mathOp
            } as { [id: string]: string };

            const reader = new ControlCharReader();
            Object.getOwnPropertyNames(characters).forEach((key: string) => {
                const buffer = new Buffer(`${key}abcd`);
                const iterator = new CharIterator(buffer);
                iterator.moveNext();

                const codeBlockToken = reader._read(iterator);
                expect(codeBlockToken).toBeDefined();
                expect(codeBlockToken.tokenType).toEqual(characters[key]);
                expect(codeBlockToken.tokenValue).toEqual(key);
                expect(codeBlockToken.lineNumber).toEqual(0);
                expect(codeBlockToken.colNumber).toEqual(0);
                expect(codeBlockToken.index).toEqual(0);

                expect(iterator.current).toEqual('a');
            });
        });

        it('should throw if there is a wrong symbol in the iterator', () => {
            const buffer = new Buffer('a');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            expect(() => reader._read(iterator)).toThrowError('Char "a" is not a control char');
        });
    });
});
