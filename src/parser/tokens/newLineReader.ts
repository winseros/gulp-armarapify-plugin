import { ReaderBase } from './readerBase';
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
            colNumber: iterator.column,
            index: iterator.index
        } as Token<string>;

        if (lf === iterator.current) {
            iterator.moveNext();
        } else if (cr === iterator.current) {
            iterator.moveNext();
            if (lf === iterator.current as any) {
                iterator.moveNext();
            }
        } else {
            const symbolCode = iterator.current.charCodeAt(0);
            const message = `Expected CR or LF bymbol but got \"${iterator.current}\", code: ${symbolCode}`;
            throw new ParserError(message, iterator.line, iterator.column, iterator.index);
        }

        return result;
    }
}