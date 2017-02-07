import { CharIterator } from '../../charIterator';
import { tokenTypes } from '../tokenTypes';
import { HexReader } from '../hexReader';
import { Token } from '../token';

describe('parser/tokens/hexReader', () => {
    describe('read', () => {
        it('should return undefined if token does not start with 0', () => {
            const buffer = new Buffer('abc1');
            const iterator = new CharIterator(buffer);
            const reader = new HexReader();

            iterator.moveNext();
            const token = reader.read(iterator);
            expect(token).not.toBeDefined();
        });

        it('should return undefined if token does not start with 0x', () => {
            const buffer = new Buffer('0a1');
            const iterator = new CharIterator(buffer);
            const reader = new HexReader();

            iterator.moveNext();
            const token = reader.read(iterator);
            expect(token).not.toBeDefined();

            expect(iterator.current).toEqual('0');
        });

        it('should return undefined if string is not a hex number', () => {
            const buffer = new Buffer('0x0101y');
            const iterator = new CharIterator(buffer);
            const reader = new HexReader();

            iterator.moveNext();
            const token = reader.read(iterator);
            expect(token).not.toBeDefined();

            expect(iterator.current).toEqual('0');
        });

        it('should return an integer token if string is a valid hex', () => {
            const buffer = new Buffer('0x0a ');
            const iterator = new CharIterator(buffer);
            const reader = new HexReader();

            iterator.moveNext();
            const token = reader.read(iterator) as Token<number>;

            expect(token.tokenType).toEqual(tokenTypes.integer);
            expect(token.tokenValue).toEqual(10);
            expect(token.lineNumber).toEqual(0);
            expect(token.colNumber).toEqual(0);

            expect(iterator.current).toEqual(' ');
        });

        it('should return a float token if string is a valid hex and value is too large', () => {
            const buffer = new Buffer('0xffffffffa;');
            const iterator = new CharIterator(buffer);
            const reader = new HexReader();

            iterator.moveNext();
            const token = reader.read(iterator) as Token<number>;

            expect(token.tokenType).toEqual(tokenTypes.float);
            expect(token.tokenValue).toEqual(68719476730);
            expect(token.lineNumber).toEqual(0);
            expect(token.colNumber).toEqual(0);

            expect(iterator.current).toEqual(';');
        });
    });
});