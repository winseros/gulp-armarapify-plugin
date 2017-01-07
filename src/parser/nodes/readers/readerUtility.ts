import { TokenIterator } from './../../tokenIterator';
import { Token } from './../../tokens/token';
import { tokenTypes } from './../../tokens/tokenTypes';
import { NodeError } from './../../nodeError';

export class ReaderUtility {
    private _iterator: TokenIterator;
    private _ignoreTokenTypes: string[] | null;

    constructor(iterator: TokenIterator) {
        this._iterator = iterator;
        this._resetDefaults();
    }

    get iterator(): TokenIterator {
        return this._iterator;
    }

    _resetDefaults(): void {
        this._ignoreTokenTypes = null;
    }

    skip(...ignored: string[]): this {
        this._ignoreTokenTypes = ignored;
        return this;
    }

    nextToken(errorDescription: string, ...expectedTokenTypes: string[]): Token<string | number> {
        const eof = this.moveToNextTokenOrEof();
        if (eof) {
            this._resetDefaults();
            throw new NodeError(`${errorDescription} expected but got EOF`, this._iterator.line, this._iterator.column);
        }

        const current = this._iterator.current;
        if (expectedTokenTypes.indexOf(current.tokenType) < 0) {
            this._resetDefaults();

            const value = this._getTokenValue(current);
            throw new NodeError(`${errorDescription} expected but got "${value}"`, this._iterator.line, this._iterator.column);
        }

        this._resetDefaults();

        return current;
    }

    _getTokenValue(token: Token<string | number>): string | number {
        let value: string | number;

        switch (token.tokenType) {
            case tokenTypes.whitespace: { value = 'whitespace'; break; }
            case tokenTypes.newline: { value = 'newline'; break; }
            default: { value = token.tokenValue; }
        }

        return value;
    }

    moveToNextTokenOrEof(): boolean {
        let eof = true;

        while (this._iterator.moveNext()) {
            const tokenType = this._iterator.current.tokenType;
            if (tokenType === tokenTypes.comment || this._ignoreTokenTypes && this._ignoreTokenTypes.indexOf(tokenType) >= 0) {
                continue;
            }
            eof = false;
            break;
        }

        return eof;
    }

    moveToNextToken(): void {
        const eof = this.moveToNextTokenOrEof();
        if (eof) {
            this._resetDefaults();
            throw new NodeError(`Any token expected but got EOF`, this._iterator.line, this._iterator.column);
        }
    }
}