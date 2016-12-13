import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { ParserError } from '../ParserError';

const symbolQuote = '"';
const symbolR = '\r';
const symbolN = '\n';

export class StringReader extends TokenReader<string>{
    canRead(iterator: Iterator<string>): boolean {
        const isQuote = iterator.current === symbolQuote;
        return isQuote;
    }

    read(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.string,
            tokenValue: '',
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<string>;

        let complete = false;
        while (iterator.moveNext()) {
            if (iterator.current === symbolR || iterator.current === symbolN) {
                throw new ParserError('Strings can not wrap on a new line', iterator.line, iterator.column);
            } else if (iterator.current === symbolQuote) {
                iterator.moveNext();
                complete = true;
                break;
            } else {
                result.tokenValue += iterator.current;
            }
        }

        if (!complete) {
            throw new ParserError(`A string should end with a ${symbolQuote} sign`, iterator.line, iterator.column);
        }

        return result;
    }
}