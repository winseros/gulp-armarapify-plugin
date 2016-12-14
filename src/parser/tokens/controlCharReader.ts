import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { ParserError } from '../ParserError';

const symbols = new Map();
symbols.set('{', tokenTypes.codeBlockStart);
symbols.set('}', tokenTypes.codeBlockEnd);
symbols.set(';', tokenTypes.semicolon);
symbols.set(',', tokenTypes.colon);
symbols.set('[', tokenTypes.squareBracketOpen);
symbols.set(']', tokenTypes.squareBracketClose);

export class ControlCharReader extends TokenReader<string> {
    canRead(iterator: Iterator<string>): boolean {
        const canRead = symbols.has(iterator.current);
        return canRead;
    }

    read(iterator: Iterator<string>): Token<string> {
        const tokenType = symbols.get(iterator.current);
        if (tokenType) {
            const result = {
                tokenType: tokenType,
                tokenValue: iterator.current,
                lineNumber: iterator.line,
                colNumber: iterator.column
            } as Token<string>;

            iterator.moveNext();

            return result;
        } else {
            throw new ParserError(`Char \"${iterator.current}\" is not a control char`, iterator.line, iterator.column);
        }
    }
}