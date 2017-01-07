import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';

const cr = '\r';
const lf = '\n';

export class NewLineReader extends TokenReader<string> {
    canRead(iterator: Iterator<string>): boolean {
        const current = iterator.current;
        const newLine = current === cr || current === lf;
        return newLine;
    }

    read(iterator: Iterator<string>): Token<string> {
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
        }

        return result;
    }
}