import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { ControlCharReader } from '../controlCharReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/codeBlockReader', () => {

    describe('canRead', () => {
        it('should return true for the "{" char', () => {
            const iterator = { current: '{' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "}" char', () => {
            const iterator = { current: '}' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the ";" char', () => {
            const iterator = { current: ';' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "," char', () => {
            const iterator = { current: ',' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "=" char', () => {
            const iterator = { current: '=' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "[" char', () => {
            const iterator = { current: '[' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "]" char', () => {
            const iterator = { current: ']' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "\r" char', () => {
            const iterator = { current: '\r' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the "\n" char', () => {
            const iterator = { current: '\n' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(true);
        });

        it('should return true for the any other symbol', () => {
            const iterator = { current: '1' } as Iterator<string>;
            const reader = new ControlCharReader();
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read the codeBlockStart char', () => {
            const buffer = new Buffer('{abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.codeBlockStart);
            expect(codeBlockToken.tokenValue).toEqual('{');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the codeBlockEnd char', () => {
            const buffer = new Buffer('}abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.codeBlockEnd);
            expect(codeBlockToken.tokenValue).toEqual('}');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the semiColon char', () => {
            const buffer = new Buffer(';abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.semicolon);
            expect(codeBlockToken.tokenValue).toEqual(';');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the comma char', () => {
            const buffer = new Buffer(',abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.comma);
            expect(codeBlockToken.tokenValue).toEqual(',');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the equals char', () => {
            const buffer = new Buffer('=abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.equals);
            expect(codeBlockToken.tokenValue).toEqual('=');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the squareBracketOpen char', () => {
            const buffer = new Buffer('[abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.squareBracketOpen);
            expect(codeBlockToken.tokenValue).toEqual('[');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the squareBracketClose char', () => {
            const buffer = new Buffer(']abcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.squareBracketClose);
            expect(codeBlockToken.tokenValue).toEqual(']');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the cr char', () => {
            const buffer = new Buffer('\rabcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.cr);
            expect(codeBlockToken.tokenValue).toEqual('\r');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read the cr char', () => {
            const buffer = new Buffer('\nabcd');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            const codeBlockToken = reader.read(iterator);
            expect(codeBlockToken).toBeDefined();

            expect(codeBlockToken.tokenType).toEqual(tokenTypes.lf);
            expect(codeBlockToken.tokenValue).toEqual('\n');
            expect(codeBlockToken.lineNumber).toEqual(0);
            expect(codeBlockToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should throw if there is a wrong symbol in the iterator', () => {
            const buffer = new Buffer('a');
            const iterator = new CharIterator(buffer);
            const reader = new ControlCharReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Char "a" is not a control char');
        });
    });
});
