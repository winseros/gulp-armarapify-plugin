import { readerUtility } from './../readerUtility';
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
        it('should call internal methods', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 }
            }));

            spyOn(readerUtility, 'moveToNextSensitiveToken').and.callThrough();
            readerUtility.nextToken(tokenIterator, 'error-description', tokenTypes.string);

            expect(readerUtility.moveToNextSensitiveToken).toHaveBeenCalledTimes(1);
            expect(readerUtility.moveToNextSensitiveToken).toHaveBeenCalledWith(tokenIterator, 'error-description');
        });

        it('should return the next non-comment, non-cr, non-lf token', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 3, colNumber: 4 },
                2: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 5, colNumber: 6 },
                3: expected
            }));

            const result = readerUtility.nextToken(tokenIterator, 'anything', tokenTypes.string);
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(4);
        });

        it('should return the next suitable token', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: expected,
                2: { tokenType: tokenTypes.number, tokenValue: 123, lineNumber: 5, colNumber: 6 }
            }));

            const result = readerUtility.nextToken(tokenIterator, 'anything', tokenTypes.string, tokenTypes.number);
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
        });

        it('should throw in case of unexpected token type', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 1, colNumber: 2 }
            }));

            expect(() => readerUtility.nextToken(tokenIterator, 'some-token', tokenTypes.number)).toThrowError('some-token expected but got "some-value"');
        });
    });

    describe('nextTokenOnCurrentLine', () => {
        it('should call internal methods', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 }
            }));

            spyOn(readerUtility, 'moveToNextSensitiveToken').and.callThrough();
            readerUtility.nextTokenOnCurrentLine(tokenIterator, 'error-description', tokenTypes.string);

            expect(readerUtility.moveToNextSensitiveToken).toHaveBeenCalledTimes(1);
            expect(readerUtility.moveToNextSensitiveToken).toHaveBeenCalledWith(tokenIterator, 'error-description', tokenTypes.comment);
        });

        it('should return the next non-comment token', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: expected
            }));

            const result = readerUtility.nextTokenOnCurrentLine(tokenIterator, 'anything', tokenTypes.string);
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
        });

        it('should return the next suitable token', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: expected,
                2: { tokenType: tokenTypes.number, tokenValue: 123, lineNumber: 5, colNumber: 6 }
            }));

            const result = readerUtility.nextTokenOnCurrentLine(tokenIterator, 'anything', tokenTypes.string, tokenTypes.number);
            expect(result).toBe(expected);

            expect(spyMoveNext).toHaveBeenCalledTimes(2);
        });

        it('should throw in case of CR token', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 1, colNumber: 2 }
            }));

            expect(() => readerUtility.nextTokenOnCurrentLine(tokenIterator, 'some-token', tokenTypes.number)).toThrowError('some-token expected but got EOL');
        });

        it('should throw in case of LF token', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 1, colNumber: 2 }
            }));

            expect(() => readerUtility.nextTokenOnCurrentLine(tokenIterator, 'some-token', tokenTypes.number)).toThrowError('some-token expected but got EOL');
        });

        it('should throw in case of unexpected token type', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 1, colNumber: 2 }
            }));

            expect(() => readerUtility.nextTokenOnCurrentLine(tokenIterator, 'some-token', tokenTypes.number)).toThrowError('some-token expected but got "some-value"');
        });
    });

    describe('moveToNextSensitiveToken', () => {
        it('should call internalMethods', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;

            spyOn(readerUtility, 'moveToNextSensitiveTokenOrEof').and.returnValue(false);

            readerUtility.moveToNextSensitiveToken(tokenIterator, 'some-desc', tokenTypes.string, tokenTypes.number);

            expect(readerUtility.moveToNextSensitiveTokenOrEof).toHaveBeenCalledTimes(1);
            expect(readerUtility.moveToNextSensitiveTokenOrEof).toHaveBeenCalledWith(tokenIterator, 'some-desc', tokenTypes.string, tokenTypes.number);

        });

        it('should throw in case of EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;

            spyOn(readerUtility, 'moveToNextSensitiveTokenOrEof').and.returnValue(true);

            expect(() => readerUtility.moveToNextSensitiveToken(tokenIterator, 'some-token')).toThrowError('some-token expected but got EOF');
        });
    });

    describe('moveToNextSensitiveTokenOrEof', () => {
        it('should move iterator to the next sensitive token using default non-sense-token types', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 3, colNumber: 4 },
                2: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 5, colNumber: 6 },
                3: expected
            }));

            const eof = readerUtility.moveToNextSensitiveTokenOrEof(tokenIterator, 'anything');
            expect(eof).toEqual(false);

            expect(tokenIterator.current).toBe(expected);
            expect(spyMoveNext).toHaveBeenCalledTimes(4);
        });

        it('should move iterator to the next sensitive token using supplied non-sense-token types', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            const expected = { tokenType: tokenTypes.cr, tokenValue: '\r', lineNumber: 3, colNumber: 4 };
            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, {
                0: { tokenType: tokenTypes.comment, tokenValue: '', lineNumber: 1, colNumber: 2 },
                1: expected,
                2: { tokenType: tokenTypes.lf, tokenValue: '\n', lineNumber: 5, colNumber: 6 },
                3: { tokenType: tokenTypes.string, tokenValue: 'some-value', lineNumber: 7, colNumber: 8 }
            }));

            const eof = readerUtility.moveToNextSensitiveTokenOrEof(tokenIterator, 'anything', tokenTypes.comment);
            expect(eof).toEqual(false);

            expect(tokenIterator.current).toBe(expected);
            expect(spyMoveNext).toHaveBeenCalledTimes(2);
        });

        it('should return true in case of EOF', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.returnValue(false);

            const eof = readerUtility.moveToNextSensitiveTokenOrEof(tokenIterator, 'some-token');
            expect(eof).toEqual(true);
        });
    });
});
