import { tokenTypes } from './../tokens/tokenTypes';
import { mathOperators } from './../../mathOperators';
import { TokenIterator } from '../tokenIterator';

const expectNext = (iterator: TokenIterator, tokenType: string, tokenValue: string | number, lineNumber: number, colNumber: number) => {
    const next = iterator.moveNext();
    expect(next).toEqual(true);
    expect(iterator.current.tokenType).toEqual(tokenType);
    expect(iterator.current.tokenValue).toEqual(tokenValue);
    expect(iterator.current.lineNumber).toEqual(lineNumber);
    expect(iterator.current.colNumber).toEqual(colNumber);
    expect(iterator.line).toEqual(lineNumber);
    expect(iterator.column).toEqual(colNumber);
    expect(iterator.depleted).toEqual(false);
};

describe('tokenIterator', () => {
    describe('moveNext', () => {
        it('should iterate through the tokens', () => {
            const data = 'class MyClass { myProperty1="string-value"; \r\n myProperty2=12345; \r myProperty3[] = {1,2};\n}; \r\n ';
            const iterator = new TokenIterator(new Buffer(data));

            //line 0
            expectNext(iterator, tokenTypes.word, 'class', 0, 0);
            expectNext(iterator, tokenTypes.whitespace, ' ', 0, 5);
            expectNext(iterator, tokenTypes.word, 'MyClass', 0, 6);
            expectNext(iterator, tokenTypes.whitespace, ' ', 0, 13);
            expectNext(iterator, tokenTypes.codeBlockStart, '{', 0, 14);
            expectNext(iterator, tokenTypes.whitespace, ' ', 0, 15);
            expectNext(iterator, tokenTypes.word, 'myProperty1', 0, 16);
            expectNext(iterator, tokenTypes.equals, '=', 0, 27);
            expectNext(iterator, tokenTypes.string, 'string-value', 0, 28);
            expectNext(iterator, tokenTypes.semicolon, ';', 0, 42);
            expectNext(iterator, tokenTypes.whitespace, ' ', 0, 43);
            expectNext(iterator, tokenTypes.newline, '\r\n', 0, 44);

            //line 1
            expectNext(iterator, tokenTypes.whitespace, ' ', 1, 0);
            expectNext(iterator, tokenTypes.word, 'myProperty2', 1, 1);
            expectNext(iterator, tokenTypes.equals, '=', 1, 12);
            expectNext(iterator, tokenTypes.integer, 12345, 1, 13);
            expectNext(iterator, tokenTypes.semicolon, ';', 1, 18);
            expectNext(iterator, tokenTypes.whitespace, ' ', 1, 19);
            expectNext(iterator, tokenTypes.newline, '\r\n', 1, 20);

            //line 2
            expectNext(iterator, tokenTypes.whitespace, ' ', 2, 0);
            expectNext(iterator, tokenTypes.word, 'myProperty3', 2, 1);
            expectNext(iterator, tokenTypes.squareBracketOpen, '[', 2, 12);
            expectNext(iterator, tokenTypes.squareBracketClose, ']', 2, 13);
            expectNext(iterator, tokenTypes.whitespace, ' ', 2, 14);
            expectNext(iterator, tokenTypes.equals, '=', 2, 15);
            expectNext(iterator, tokenTypes.whitespace, ' ', 2, 16);
            expectNext(iterator, tokenTypes.codeBlockStart, '{', 2, 17);
            expectNext(iterator, tokenTypes.integer, 1, 2, 18);
            expectNext(iterator, tokenTypes.comma, ',', 2, 19);
            expectNext(iterator, tokenTypes.integer, 2, 2, 20);
            expectNext(iterator, tokenTypes.codeBlockEnd, '}', 2, 21);
            expectNext(iterator, tokenTypes.semicolon, ';', 2, 22);
            expectNext(iterator, tokenTypes.newline, '\r\n', 2, 23);

            //line 3
            expectNext(iterator, tokenTypes.codeBlockEnd, '}', 3, 0);
            expectNext(iterator, tokenTypes.semicolon, ';', 3, 1);
            expectNext(iterator, tokenTypes.whitespace, ' ', 3, 2);
            expectNext(iterator, tokenTypes.newline, '\r\n', 3, 3);

            //line 4
            expectNext(iterator, tokenTypes.whitespace, ' ', 4, 0);

            expect(iterator.moveNext()).toEqual(false);
            expect(iterator.depleted).toEqual(true);
        });

        it('should iterate through "-a" expression', () => {
            const data = '-1';
            const iterator = new TokenIterator(new Buffer(data));

            //line 0
            expectNext(iterator, tokenTypes.mathOp, mathOperators.minus, 0, 0);
            expectNext(iterator, tokenTypes.integer, 1, 0, 1);

            expect(iterator.moveNext()).toEqual(false);
            expect(iterator.depleted).toEqual(true);
        });

        it('should iterate through "a + b" expression', () => {
            const data = '1 + 2';
            const iterator = new TokenIterator(new Buffer(data));

            //line 0
            expectNext(iterator, tokenTypes.integer, 1, 0, 0);
            expectNext(iterator, tokenTypes.whitespace, ' ', 0, 1);
            expectNext(iterator, tokenTypes.mathOp, mathOperators.plus, 0, 2);
            expectNext(iterator, tokenTypes.whitespace, ' ', 0, 3);
            expectNext(iterator, tokenTypes.integer, 2, 0, 4);

            expect(iterator.moveNext()).toEqual(false);
            expect(iterator.depleted).toEqual(true);
        });
    });

    describe('createCheckpoint', () => {
        it('should throw an exception', () => {
            const data = 'class';
            const iterator = new TokenIterator(new Buffer(data));

            expect(() => iterator.createCheckpoint()).toThrowError('Not implemented');
        });
    });
});
