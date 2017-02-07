import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { regexp } from './regexp';

const symbolX = 'x';
const symbol0 = '0';

export class HexReader implements TokenReader<number> {

    static readonly uIntMax = 4294967295;

    public read(iterator: Iterator<string>): Token<number> | undefined {
        let result;
        const line = iterator.line;
        const column = iterator.column;
        if (iterator.current === symbol0) {
            const checkpoint = iterator.createCheckpoint();
            if (iterator.moveNext() && iterator.current.toLowerCase() === symbolX) {
                const value = this._readHex(iterator);
                result = this._formatToken(value, line, column);
            }
            if (!result) {
                checkpoint.restore();
            }
        }
        return result;
    }

    _readHex(iterator: Iterator<string>): string | undefined {
        let value: string | undefined = '0x';
        while (iterator.moveNext()) {
            const char = iterator.current.toLowerCase();
            if (regexp.hex.test(char)) {
                value += char;
            } else if (regexp.letter.test(iterator.current)) {
                value = undefined;//that was not a number but a word starting with a 0x
                break;
            } else {
                break;
            }
        }

        return value;
    }

    _formatToken(value: string | undefined, line: number, column: number): Token<number> | undefined {
        let result;
        const num = parseInt(value!, 16);
        if (!isNaN(num)) {
            const tokenType = num > HexReader.uIntMax ? tokenTypes.float : tokenTypes.integer;
            result = {
                tokenType: tokenType,
                tokenValue: num,
                lineNumber: line,
                colNumber: column
            } as Token<number>;
        }
        return result;
    }
}