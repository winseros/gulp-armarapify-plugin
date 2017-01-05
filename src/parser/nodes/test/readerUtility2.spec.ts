import { ReaderUtility } from './../readerUtility2';
import { tokenTypes } from './../../tokens/tokenTypes';
import { Token } from '../../tokens/token';
import { TokenIterator } from '../../tokenIterator';

type CallConfig = { [index: number]: Token<any> };
const implementFakeIterator = (iteratorMock: any, calls: CallConfig): any => {
    let callIndex = 0;
    return (): boolean => {
        iteratorMock.current = calls[callIndex];
        callIndex++;
        return !!iteratorMock.current;
    };
};

describe('parser/nodes/readerUtility', () => {
    describe('nextToken', () => {
        it('should throw if expectedTokens are not configured', () => {
            const tokenIterator = {} as TokenIterator;
            const utility = new ReaderUtility(tokenIterator);

            spyOn(utility, '_resetDefaults');

            expect(() => utility.nextToken('anything')).toThrowError('The expectedTokens have not been configured. Call the expectTokens() method before this one.');

            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should read the next token ignoring comments', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: expected
            }));

            const utility = new ReaderUtility(tokenIterator);
            spyOn(utility, '_resetDefaults');

            const result = utility.expectTokens(tokenTypes.string).nextToken('anything');
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should read the next token ignoring specified tokens', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 9, colNumber: 10 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 3, colNumber: 4 },
                2: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 5, colNumber: 6 },
                3: { tokenType: tokenTypes.whitespace, tokenValue: ' ', lineNumber: 7, colNumber: 8 },
                4: expected
            }));

            const utility = new ReaderUtility(tokenIterator);
            spyOn(utility, '_resetDefaults');

            const result = utility.ignoreTokens(tokenTypes.cr, tokenTypes.lf, tokenTypes.whitespace).expectTokens(tokenTypes.string).nextToken('anything');
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(5);
            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should throw in case of EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.returnValue(false);

            const utility = new ReaderUtility(tokenIterator);

            spyOn(utility, '_resetDefaults');

            expect(() => utility.expectTokens(tokenTypes.word).nextToken('anything')).toThrowError('anything expected but got EOF');

            expect(utility._resetDefaults).toHaveBeenCalledTimes(1);
        });

        it('should throw in case of unexpected token type', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 3, colNumber: 4 },
                1: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 5, colNumber: 6 },
                2: { tokenType: tokenTypes.whitespace, tokenValue: ' ', lineNumber: 7, colNumber: 8 },
                3: { tokenType: tokenTypes.number, tokenValue: 12345, lineNumber: 9, colNumber: 10 }
            }));

            const utility = new ReaderUtility(tokenIterator);
            spyOn(utility, '_resetDefaults');

            const spyReset = utility._resetDefaults as jasmine.Spy;

            ['#13', '#10', 'whitespace', '12345'].forEach(value => {
                const msg = `anything expected but got "${value}"`;
                expect(() => utility.expectTokens(tokenTypes.word).nextToken('anything')).toThrowError(msg);
                expect(spyReset).toHaveBeenCalledTimes(1);
                spyReset.calls.reset();
            });
        });
    });

    describe('moveToNextTokenOrEof', () => {
        it('should move to next token ignorring comments and return false if not EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: expected
            }));

            const utility = new ReaderUtility(tokenIterator);

            const result = utility.expectTokens(tokenTypes.string).moveToNextTokenOrEof('anything');
            expect(result).toBe(false);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
            expect(tokenIterator.current).toBe(expected);
        });

        it('should move to next token ignorring specified tokens and return false if not EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 3, colNumber: 4 },
                2: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 5, colNumber: 6 },
                3: { tokenType: tokenTypes.whitespace, tokenValue: ' ', lineNumber: 7, colNumber: 8 },
                4: expected
            }));

            const utility = new ReaderUtility(tokenIterator);

            const result = utility.ignoreTokens(tokenTypes.cr, tokenTypes.lf, tokenTypes.whitespace).expectTokens(tokenTypes.string).moveToNextTokenOrEof('anything');
            expect(result).toBe(false);

            expect(spyMoveNext).toHaveBeenCalledTimes(5);
            expect(tokenIterator.current).toBe(expected);
        });

        it('should move to next token ignorring comments tokens and return true if EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 }
            }));

            const utility = new ReaderUtility(tokenIterator);

            const result = utility.expectTokens(tokenTypes.string).moveToNextTokenOrEof('anything');
            expect(result).toBe(true);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
        });
    });
});
