import { Iterator } from '../../iterator';
import { CharIterator } from '../../charIterator';
import { NumberReader } from '../numberReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/numberReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator char is a number symbol', () => {
            const reader = new NumberReader();
            const iterator = {} as Iterator<string>;
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '.'].forEach(num => {
                iterator.current = num;
                const canRead = reader.canRead(iterator);
                expect(canRead).toEqual(true);
            });
        });

        it('should return false if current iterator char is a non-numeric symbol', () => {
            const reader = new NumberReader();
            const iterator = { current: 'a' } as Iterator<string>;
            const canRead = reader.canRead(iterator);
            expect(canRead).toEqual(false);
        });
    });

    describe('read', () => {
        it('should read an integer number', () => {
            const buffer = new Buffer('1234567890abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(1234567890);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read an float number', () => {
            const buffer = new Buffer('12340.56789abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(12340.56789);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read an float number starting from "."', () => {
            const buffer = new Buffer('.56789abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(0.56789);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read an negative number', () => {
            const buffer = new Buffer('-12340.56789abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(-12340.56789);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read an number in scientific notation with + sign', () => {
            const buffer = new Buffer('1e+3abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(1000);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read an number in scientific notation with - sign', () => {
            const buffer = new Buffer('1e-3abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(0.001);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should read an number in scientific notation with uppercase E sign', () => {
            const buffer = new Buffer('1E3abc');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            const commentToken = reader.read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.number);
            expect(commentToken.tokenValue).toEqual(1000);
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('a');
        });

        it('should throw if number contains a duplicating "." symbol', () => {
            const buffer = new Buffer('123.456.012');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Found a duplicating "." symbol in a number');
        });

        it('should throw if number contains a "e" after "." symbol', () => {
            const buffer = new Buffer('123.456e012');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('A number can not contain a "e" after a "."');
        });

        it('should throw if number contains a duplicating "e" symbol', () => {
            const buffer = new Buffer('123e456e012');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Found a duplicating "e" symbol in a number');
        });

        it('should throw if number contains a "." after "e" symbol', () => {
            const buffer = new Buffer('123e456.012');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('A number can not contain a "." after a "e"');
        });

        it('should throw if number string contains no digits', () => {
            const buffer = new Buffer('+');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Could not parse a number');
        });

        it('should throw if number string ends with a "." or "e"', () => {
            const endings = ['.', 'e'];
            endings.forEach((end) => {
                const buffer = new Buffer(`12345${end}`);

                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError(`A number can not end with a "${end}" symbol`);
            });
        });

        it('should throw if number string ends with a "+" or "-"', () => {
            const endings = ['+', '-'];
            endings.forEach((end) => {
                const buffer = new Buffer(`12345e${end}`);

                const iterator = new CharIterator(buffer);
                const reader = new NumberReader();

                iterator.moveNext();
                expect(() => reader.read(iterator)).toThrowError(`A number can not end with a "${end}" symbol`);
            });
        });

        it('should throw if could not parse a number', () => {
            const buffer = new Buffer('e+1');
            const iterator = new CharIterator(buffer);
            const reader = new NumberReader();

            iterator.moveNext();
            expect(() => reader.read(iterator)).toThrowError('Couldn\'t convert value "e+1" into a number');
        });
    });

});
