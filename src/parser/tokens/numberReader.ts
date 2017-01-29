import { ParserError } from './../parserError';
import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator, Checkpoint } from '../iterator';
import { tokenTypes } from './tokenTypes';

const symbolMinus = '-';
const symbolPlus = '+';
const symbolDot = '.';
const symbolE = 'e';
const charCode0 = 48;
const charCode9 = 57;

export class NumberReader implements TokenReader<number> {
    canRead(iterator: Iterator<string>): boolean {
        const hasSpecialChar = iterator.current === symbolMinus
            || iterator.current === symbolPlus
            || iterator.current === symbolDot;

        let checkpoint: Checkpoint<string> | undefined;
        if (hasSpecialChar) {
            checkpoint = iterator.createCheckpoint();
            if (!iterator.moveNext()) {
                checkpoint.restore();
                return false;
            }
        }

        const charCode = iterator.current.charCodeAt(0);
        const isNumber = charCode >= charCode0 && charCode <= charCode9;

        if (checkpoint) {
            checkpoint.restore();
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
                    const msg = `Found a duplicating "${symbolDot}" symbol in a number`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else if (e) {
                    const msg = `A number can not contain a "${symbolDot}" after a "${symbolE}"`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else {
                    dot = true;
                    result += iterator.current;
                }
            } else if (iterator.current.toLowerCase() === symbolE) {
                if (e) {
                    const msg = `Found a duplicating "${symbolE}" symbol in a number`;
                    throw new ParserError(msg, iterator.line, iterator.column);
                } else {
                    e = true;
                    result += iterator.current;
                }
            } else if ((iterator.current === symbolPlus || iterator.current === symbolMinus) && result.length && result[result.length - 1].toLowerCase() === symbolE) {
                result += iterator.current;
            } else {
                break;
            }
        }

        if (!result.length) {
            throw new ParserError('Could not parse a number', iterator.line, iterator.column);
        } else {
            const code = result.charCodeAt(result.length - 1);
            if (code < charCode0 || code > charCode9) {
                const msg = `A number can not end with a "${result[result.length - 1]}" symbol`;
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