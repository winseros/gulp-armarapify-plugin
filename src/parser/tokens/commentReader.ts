import { ReaderBase } from './readerBase';
import { Token } from './token';
import { Iterator } from '../iterator';
import { ParserError } from '../parserError';
import { tokenTypes } from './tokenTypes';

const commentStart = '/';
const commentSingleLine = '/';
const commentMultiline = '*';

export class CommentReader extends ReaderBase<string> {
    _canRead(iterator: Iterator<string>): boolean {
        let isComment = iterator.current === commentStart;
        if (isComment) {
            const checkpoint = iterator.createCheckpoint();
            isComment = checkpoint.moveNext() && (checkpoint.current === commentSingleLine || checkpoint.current === commentMultiline);
            checkpoint.restore();
        }
        return isComment;
    }

    _read(iterator: Iterator<string>): Token<string> {
        if (iterator.moveNext()) {
            switch (iterator.current) {
                case commentSingleLine: {
                    const result = this._readSingleline(iterator);
                    return result;
                }
                case commentMultiline: {
                    const result = this._readMultiline(iterator);
                    return result;
                }
                default: {
                    //no "/" or "*" symbol after the comment start
                    const message = `Expected "${commentSingleLine}" or "${commentMultiline}" but got "${iterator.current}"`;
                    throw new ParserError(message, iterator.line, iterator.column, iterator.index);
                }
            }
        } else {
            //no any symbols after the comment start
            const message = `Expected "${commentSingleLine}" or "${commentMultiline}" but got EOF`;
            throw new ParserError(message, iterator.line, iterator.column, iterator.index);
        }
    }

    _readSingleline(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.comment,
            tokenValue: '',
            lineNumber: iterator.line,
            colNumber: iterator.column - 1,
            index: iterator.index - 1
        } as Token<string>;

        while (iterator.moveNext() && iterator.current !== '\r' && iterator.current !== '\n') {
            result.tokenValue += iterator.current;
        }
        return result;
    }

    _readMultiline(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.comment,
            tokenValue: '',
            lineNumber: iterator.line,
            colNumber: iterator.column - 1,
            index: iterator.index - 1
        } as Token<string>;

        while (iterator.moveNext()) {
            if (iterator.current === commentMultiline) {
                const prev = iterator.current;
                if (iterator.moveNext()) {
                    if (commentStart === iterator.current as any) {
                        iterator.moveNext();
                        break;
                    } else {
                        result.tokenValue += prev;
                        result.tokenValue += iterator.current;
                    }
                } else {
                    result.tokenValue += prev;
                }
            } else {
                result.tokenValue += iterator.current;
            }
        }
        return result;
    }
}