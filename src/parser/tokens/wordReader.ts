import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';

const regexpLetter = /[a-zA-Z_]/;
const regexpLetterOrDigit = /[\w\d_]/;

export class WordReader implements TokenReader<string>{
    canRead(iterator: Iterator<string>): boolean {
        const match = regexpLetter.test(iterator.current);
        return match;
    }

    read(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.word,
            tokenValue: iterator.current,
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<string>;

        while (iterator.moveNext()) {
            const match = regexpLetterOrDigit.test(iterator.current);
            if (match) {
                result.tokenValue += iterator.current;
            } else {
                break;
            }
        }

        return result;
    }
}