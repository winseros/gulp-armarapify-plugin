import { PropertyNodeReader } from '../propertyNodeReader';
import { tokenTypes } from '../../../tokens/tokenTypes';
import { ReaderUtility } from '../readerUtility';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';

describe('parser/nodes/readers/propertyNodeReader', () => {
    describe('canRead', () => {
        it('should return true if current iterator token is a "word" and its value is not "class"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'propertyName'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new PropertyNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(true);
        });

        it('should return false if current iterator token is not a "word"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.equals,
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new PropertyNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });

        it('should return false if current iterator token is a "word" and its value is "class"', () => {
            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: tokenTypes.word,
                        tokenValue: 'CLaSs'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            const reader = new PropertyNodeReader();
            const canRead = reader.canRead(readerUtility);

            expect(canRead).toEqual(false);
        });
    });
});
