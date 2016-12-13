import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { ParserError } from '../ParserError';

const symbolMinus = '-';
const symbolPlus = '+';
const symbolDot = '.';
const charCode0 = 48;
const charCode9 = 57;

export class NumberReader extends TokenReader<number> {
    canRead(iterator: Iterator<string>): boolean {
        let isNumber = iterator.current === symbolMinus
            || iterator.current === symbolPlus
            || iterator.current === symbolDot;

        if (!isNumber){
            const charCode = iterator.current.charCodeAt(0);
            isNumber = charCode >= charCode0 && charCode <= charCode9;
        }
        return isNumber;
    }

    read(iterator: Iterator<string>): Token<number> {
        let dot = iterator.current === symbolDot;
        let result = iterator.current === symbolPlus ? '' : iterator.current;

        const token = {
            tokenType: tokenTypes.number,
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<number>;

        while (iterator.moveNext()) {
            const charCode = iterator.current.charCodeAt(0);
            if (charCode >= charCode0 && charCode <= charCode9) {
                result += iterator.current;
            } else if (iterator.current === symbolDot) {
                if (dot) {
                    const msg = `Found a duplicating \"${symbolDot}\" symbol in a number`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else {
                    dot = true;
                    result += iterator.current;
                }
            } else {
                break;
            }
        }

        if (!result.length) {
            throw new ParserError('Could not parse a number', iterator.line, iterator.column);
        } else if (result.endsWith(symbolDot)) {
            throw new ParserError(`A number can not end with a \"${symbolDot}\" symbol`, iterator.line, iterator.column);
        }

        token.tokenValue = parseFloat(result);
        if (isNaN(token.tokenValue)) {
            throw new ParserError(`Couldn't convert value \"${result}\" into a number`, iterator.line, iterator.column);
        }

        return token;
    }
}