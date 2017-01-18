import { ParserError } from './../parserError';
import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';

const symbolMinus = '-';
const symbolPlus = '+';
const symbolDot = '.';
const symbolE = 'e';
const charCode0 = 48;
const charCode9 = 57;

export class NumberReader implements TokenReader<number> {
    canRead(iterator: Iterator<string>): boolean {
        let isNumber = iterator.current === symbolMinus
            || iterator.current === symbolPlus
            || iterator.current === symbolDot;

        if (!isNumber) {
            const charCode = iterator.current.charCodeAt(0);
            isNumber = charCode >= charCode0 && charCode <= charCode9;
        }
        return isNumber;
    }

    read(iterator: Iterator<string>): Token<number> {
        let e = false;
        let dot = iterator.current === symbolDot;
        let result = iterator.current === symbolPlus ? '' : iterator.current;

        const token = {
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<number>;

        while (iterator.moveNext()) {
            const charCode = iterator.current.charCodeAt(0);
            if (charCode >= charCode0 && charCode <= charCode9) {
                result += iterator.current;
            } else if (iterator.current === symbolDot) {
                if (dot) {
                    let msg = `Found a duplicating "${symbolDot}" symbol in a number`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else if (e) {
                    let msg = `A number can not contain a "${symbolDot}" after a "${symbolE}"`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else {
                    dot = true;
                    result += iterator.current;
                }
            } else if (iterator.current.toLowerCase() === symbolE) {
                if (e) {
                    let msg = `Found a duplicating "${symbolE}" symbol in a number`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else if (dot) {
                    let msg = `A number can not contain a \"${symbolE}" after a "${symbolDot}"`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else {
                    e = true;
                    result += iterator.current;
                }
            } else if (iterator.current === symbolPlus || iterator.current === symbolMinus) {
                if (result.length && result[result.length - 1].toLowerCase() === symbolE) {
                    result += iterator.current;
                } else {
                    let msg = `A "${iterator.current}" sign allowed only after a "${symbolE}" sign in a number`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                }
            } else {
                break;
            }
        }

        if (!result.length) {
            throw new ParserError('Could not parse a number', iterator.line, iterator.column);
        } else {
            const code = result.charCodeAt(result.length - 1);
            if (code < charCode0 || code > charCode9) {
                let msg = `A number can not end with a "${result[result.length - 1]}" symbol`;
                throw new ParserError(msg, iterator.line, iterator.column);
            }
        }

        token.tokenValue = parseFloat(result);
        if (isNaN(token.tokenValue)) {
            throw new ParserError(`Couldn't convert value "${result}" into a number`, iterator.line, iterator.column);
        }

        token.tokenType = e || dot ? tokenTypes.float : tokenTypes.integer;

        return token;
    }
}