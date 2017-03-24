import { ReaderUtility } from './../readerUtility';
import { tokenTypes } from './../../../tokens/tokenTypes';
import { Token } from '../../../tokens/token';
import { TokenIterator } from '../../../tokenIterator';

const implementFakeIterator = (iteratorMock: any, calls: Token<any>[]): any => {
    let callIndex = 0;
    return (): boolean => {
        iteratorMock.current = calls[callIndex];
        callIndex++;
        return !!iteratorMock.current;
    };
};

describe('parser/nodes/readers/readerUtility', () => {
    describe('ctor', () => {
        it('should initialize properties', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;

            const utility = new ReaderUtility(tokenIterator);

            expect(utility.iterator).toBe(tokenIterator);
        });
    });

    describe('nextToken', () => {
        it('should read the next token ignoring comments', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8, index: 0 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2, index: 0 },
                expected
            ]));

            const utility = new ReaderUtility(tokenIterator);
            spyOn(utility, '_resetDefaults');

            const result = utility.nextToken('anything', tokenTypes.string);
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should read the next token ignoring specified tokens', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8, index: 0 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2, index: 0 },
                { tokenType: tokenTypes.newline, tokenValue: '\r', lineNumber: 3, colNumber: 4, index: 0 },
                { tokenType: tokenTypes.whitespace, tokenValue: ' ', lineNumber: 5, colNumber: 6, index: 0 },
                expected
            ]));

            const utility = new ReaderUtility(tokenIterator);
            spyOn(utility, '_resetDefaults');

            const result = utility.skip(tokenTypes.newline, tokenTypes.whitespace).nextToken('anything', tokenTypes.string);
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(4);
            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should throw in case of EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.returnValue(false);

            const utility = new ReaderUtility(tokenIterator);

            spyOn(utility, '_resetDefaults');

            expect(() => utility.nextToken('anything', tokenTypes.word)).toThrowError('anything expected but got EOF');

            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should throw in case of unexpected token type', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.newline, tokenValue: '\r\n', lineNumber: 1, colNumber: 2, index: 0 },
                { tokenType: tokenTypes.whitespace, tokenValue: ' ', lineNumber: 3, colNumber: 4, index: 0 },
                { tokenType: tokenTypes.integer, tokenValue: 12345, lineNumber: 5, colNumber: 6, index: 0 }
            ]));

            const utility = new ReaderUtility(tokenIterator);
            spyOn(utility, '_resetDefaults');

            const spyReset = utility._resetDefaults as jasmine.Spy;

            ['EOL', 'whitespace', '12345'].forEach(value => {
                const msg = `anything expected but got "${value}"`;
                expect(() => utility.nextToken('anything', tokenTypes.word)).toThrowError(msg);
                expect(spyReset).toHaveBeenCalledTimes(1);
                spyReset.calls.reset();
            });
        });
    });

    describe('moveToNextTokenOrEof', () => {
        it('should move to next token ignorring comments and return false if not EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8, index: 0 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2, index: 0 },
                expected
            ]));

            const utility = new ReaderUtility(tokenIterator);

            const result = utility.moveToNextTokenOrEof();
            expect(result).toBe(false);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
            expect(tokenIterator.current).toBe(expected);
        });

        it('should move to next token ignorring specified tokens and return false if not EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8, index: 0 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2, index: 0 },
                { tokenType: tokenTypes.newline, tokenValue: '\r\n', lineNumber: 3, colNumber: 4, index: 0 },
                { tokenType: tokenTypes.whitespace, tokenValue: ' ', lineNumber: 7, colNumber: 8, index: 0 },
                expected
            ]));

            const utility = new ReaderUtility(tokenIterator);

            const result = utility.skip(tokenTypes.newline, tokenTypes.whitespace).moveToNextTokenOrEof();
            expect(result).toBe(false);

            expect(spyMoveNext).toHaveBeenCalledTimes(4);
            expect(tokenIterator.current).toBe(expected);
        });

        it('should move to next token ignorring comments tokens and return true if EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2, index: 0 }
            ]));

            const utility = new ReaderUtility(tokenIterator);

            const result = utility.moveToNextTokenOrEof();
            expect(result).toBe(true);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
        });
    });

    describe('moveToNextToken', () => {
        it('should throw in case of EOF', () => {
            const utility = new ReaderUtility({} as TokenIterator);
            spyOn(utility, 'moveToNextTokenOrEof').and.returnValue(true);
            spyOn(utility, '_resetDefaults');

            expect(() => utility.moveToNextToken()).toThrowError('Any token expected but got EOF');

            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should not throw in case of not EOF', () => {
            const utility = new ReaderUtility({} as TokenIterator);
            spyOn(utility, 'moveToNextTokenOrEof').and.returnValue(false);
            spyOn(utility, '_resetDefaults');

            expect(() => utility.moveToNextToken()).not.toThrow();

            expect(utility._resetDefaults).not.toHaveBeenCalled();
        });
    });

});
