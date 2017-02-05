import { CharIterator } from '../../charIterator';
import { NumberReader } from '../numberReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/numberReader', () => {
    describe('read', () => {
        describe('read numbers', () => {
            it('it should return undefined if trying to parse non-number', () => {
                const buffer = new Buffer('abc1');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator);
                expect(token).not.toBeDefined();
            });

            it('should read an integer number with space after', () => {
                const buffer = new Buffer('1234567890 ');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.integer);
                expect(token.tokenValue).toEqual(1234567890);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);

                expect(iterator.current).toEqual(' ');
            });

            it('should read an integer number with EOF after', () => {
                const buffer = new Buffer('1234567890');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.integer);
                expect(token.tokenValue).toEqual(1234567890);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });

            it('should read a floating-point number with point in the middle', () => {
                const buffer = new Buffer('12345.67890');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.float);
                expect(token.tokenValue).toEqual(12345.67890);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });

            it('should read a floating-point number with point in the middle', () => {
                const buffer = new Buffer('.67890');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.float);
                expect(token.tokenValue).toEqual(0.67890);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });

            it('should read a number in scientific notation #1', () => {
                const buffer = new Buffer('1.5e3');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.integer);
                expect(token.tokenValue).toEqual(1500);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });

            it('should read a number in scientific notation #2', () => {
                const buffer = new Buffer('1e+3');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.integer);
                expect(token.tokenValue).toEqual(1000);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });

            it('should read a number in scientific notation #3', () => {
                const buffer = new Buffer('1.5e-3');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.float);
                expect(token.tokenValue).toEqual(0.0015);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });

            it('should threat int as float if it is greater than maxInt', () => {
                const value = NumberReader.intMax + 1;
                const buffer = new Buffer(value.toString());
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator) !;
                expect(token).toBeDefined();

                expect(token.tokenType).toEqual(tokenTypes.float);
                expect(token.tokenValue).toEqual(value);
                expect(token.lineNumber).toEqual(0);
                expect(token.colNumber).toEqual(0);
            });
        });

        describe('throw errors', () => {
            it('should throw if can not parse a number', () => {
                const buffer = new Buffer('.');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError(`Couldn't convert value "." into a number`);
            });

            it('should throw if number contains a duplicating "." symbol', () => {
                const buffer = new Buffer('0.1.0');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError('Found a duplicating "." symbol in a number');
            });

            it('should throw if "." follows "e" symbol', () => {
                const buffer = new Buffer('1e10.1');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError('A number can not contain a "." after a "e"');
            });

            it('should throw if number ends with "." symbol', () => {
                const buffer = new Buffer('0.');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError('A digit expected but got EOF');
            });

            it('should throw if a number contains duplicating scitntific notation', () => {
                const buffer = new Buffer('1e1e1');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError('Found a duplicating "e" symbol in a number');
            });

            it('should throw if a number in scientific notation ends with +', () => {
                const buffer = new Buffer('1e+');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError('A digit expected but got EOF');
            });

            it('should throw if a number in scientific notation has no power', () => {
                const buffer = new Buffer('1e-a');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError('A digit expected but got "a", code: 97');
            });
        });

        describe('falls to read', () => {
            it('should return undefined if numbers are followed by letters', () => {
                const buffer = new Buffer('123a');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator);
                expect(token).not.toBeDefined();

                expect(iterator.current).toEqual('1');
            });

            it('should return undefined if numbers are followed by eX', () => {
                const buffer = new Buffer('123eA');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator);
                expect(token).not.toBeDefined();

                expect(iterator.current).toEqual('1');
            });

            it('should return undefined if numbers are followed by e', () => {
                const buffer = new Buffer('123e');
                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                const token = reader.read(iterator);
                expect(token).not.toBeDefined();

                expect(iterator.current).toEqual('1');
            });
        });
    });
});
