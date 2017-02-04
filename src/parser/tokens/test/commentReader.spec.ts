import { CharIterator } from '../../charIterator';
import { CommentReader } from '../commentReader';
import { tokenTypes } from '../tokenTypes';

describe('parser/tokens/commentReader', () => {
    describe('_canRead', () => {
        it('should return true if current iterator char is a single-line comment start', () => {
            const iterator = new CharIterator(new Buffer('//abc'));
            iterator.moveNext();

            const reader = new CommentReader();
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(true);

            expect(iterator.current).toEqual('/');
            expect(iterator.column).toEqual(0);
        });

        it('should return true if current iterator char is a multi-line comment start', () => {
            const iterator = new CharIterator(new Buffer('/*abc'));
            iterator.moveNext();

            const reader = new CommentReader();
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(true);

            expect(iterator.current).toEqual('/');
            expect(iterator.column).toEqual(0);
        });

        it('should return true if current iterator char is a non-comment start', () => {
            const iterator = new CharIterator(new Buffer('/abc'));
            iterator.moveNext();

            const reader = new CommentReader();
            const canRead = reader._canRead(iterator);
            expect(canRead).toEqual(false);

            expect(iterator.current).toEqual('/');
            expect(iterator.column).toEqual(0);
        });
    });

    describe('_read', () => {
        it('should read a single-line comment ending the reader', () => {
            const buffer = new Buffer('//this is a comment');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.comment);
            expect(commentToken.tokenValue).toEqual('this is a comment');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.moveNext()).toEqual(false);
        });

        it('should read a single-line comment ending with \r', () => {
            const buffer = new Buffer('//this is a comment\rsome more text');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.comment);
            expect(commentToken.tokenValue).toEqual('this is a comment');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('\r');
        });

        it('should read a single-line comment ending with \n', () => {
            const buffer = new Buffer('//this is a comment\nsome more text');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.comment);
            expect(commentToken.tokenValue).toEqual('this is a comment');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('\n');
        });

        it('should read a multiline comment ending the reader', () => {
            const buffer = new Buffer('/*this is a comment');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.comment);
            expect(commentToken.tokenValue).toEqual('this is a comment');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.moveNext()).toEqual(false);
        });

        it('should read a multiline comment ending the reader with "*"', () => {
            const buffer = new Buffer('/*this is a comment*');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.comment);
            expect(commentToken.tokenValue).toEqual('this is a comment*');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.moveNext()).toEqual(false);
        });

        it('should read a multiline comment', () => {
            const buffer = new Buffer('/*this is * a comment*/some more text');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            const commentToken = reader._read(iterator);
            expect(commentToken).toBeDefined();

            expect(commentToken.tokenType).toEqual(tokenTypes.comment);
            expect(commentToken.tokenValue).toEqual('this is * a comment');
            expect(commentToken.lineNumber).toEqual(0);
            expect(commentToken.colNumber).toEqual(0);

            expect(iterator.current).toEqual('s');
        });

        it('should throw if there is a wrong symbol after the comment start', () => {
            const buffer = new Buffer('/a');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            expect(() => reader._read(iterator)).toThrowError('Expected "/" or "*" but got "a"');
        });

        it('should throw if there are no symbols after the comment start', () => {
            const buffer = new Buffer('/');
            const iterator = new CharIterator(buffer);
            const reader = new CommentReader();

            iterator.moveNext();
            expect(() => reader._read(iterator)).toThrowError('Expected "/" or "*" but got EOF');
        });
    });
});
