import { ReaderBase } from './ReaderBase';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { ParserError } from '../parserError';

const cr = '\r';
const lf = '\n';

export class NewLineReader extends ReaderBase<string> {
    _canRead(iterator: Iterator<string>): boolean {
        const current = iterator.current;
        const newLine = current === cr || current === lf;
        return newLine;
    }

    _read(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.newline,
            tokenValue: '\r\n',
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<string>;

        if (iterator.current === lf) {
            iterator.moveNext();
        } else if (iterator.current === cr) {
            iterator.moveNext();
            if (iterator.current === lf) {
                iterator.moveNext();
            }
        } else {
            const symbolCode = iterator.current.charCodeAt(0);
            const message = `Expected CR or LF bymbol but got \"${iterator.current}\", code: ${symbolCode}`;
            throw new ParserError(message, iterator.line, iterator.column);
        }

        return result;
    }
}