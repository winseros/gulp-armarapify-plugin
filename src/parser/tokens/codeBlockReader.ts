import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { ParserError } from '../ParserError';

const codeBlockStart = '{';
const codeBlockEnd = '}';

export class CodeBlockReader extends TokenReader {
    canRead(iterator: Iterator<string>): boolean {
        const canRead = iterator.current === codeBlockStart || iterator.current === codeBlockEnd;
        return canRead;
    }

    read(iterator: Iterator<string>): Token {
        const result = {
            lineNumber: iterator.line,
            colNumber: iterator.column,
            tokenValue: iterator.current
        } as Token;

        if (iterator.current === codeBlockStart) {
            result.tokenType = tokenTypes.codeBlockStart;
        } else if (iterator.current === codeBlockEnd) {
            result.tokenType = tokenTypes.codeBlockEnd;
        } else {
            const msg = `Expected a \"${codeBlockStart}\" or \"${codeBlockEnd}\" but got a "${iterator.current}"`;
            throw new ParserError(msg, iterator.line, iterator.column);
        }

        return result;
    }
}