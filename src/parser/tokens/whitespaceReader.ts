import { ReaderBase } from './ReaderBase';
import { Iterator } from '../iterator';
import { Token } from './token';
import { tokenTypes } from './tokenTypes';

const regexSpace = /[\s^\r\n]/;

export class WhitespaceReader extends ReaderBase<string> {
    _canRead(iterator: Iterator<string>): boolean {
        const result = this._isWhitespace(iterator.current);
        return result;
    }

    _read(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.whitespace,
            tokenValue: ' ',
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<string>;

        let next: boolean;
        do {
            next = this._isWhitespace(iterator.current) && iterator.moveNext();
        } while (next);

        return result;
    }

    _isWhitespace(symbol: string): boolean {
        const result = symbol !== '\r' && symbol !== '\n' && regexSpace.test(symbol);
        return result;
    }
}