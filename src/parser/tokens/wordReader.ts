import { ReaderBase } from './ReaderBase';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { regexp } from './regexp';

export class WordReader extends ReaderBase<string>{
    _canRead(iterator: Iterator<string>): boolean {
        const match = regexp.letterOrDigit.test(iterator.current);
        return match;
    }

    _read(iterator: Iterator<string>): Token<string> {
        const result = {
            tokenType: tokenTypes.word,
            tokenValue: iterator.current,
            lineNumber: iterator.line,
            colNumber: iterator.column
        } as Token<string>;

        while (iterator.moveNext()) {
            const match = regexp.letterOrDigit.test(iterator.current);
            if (match) {
                result.tokenValue += iterator.current;
            } else {
                break;
            }
        }

        return result;
    }
}