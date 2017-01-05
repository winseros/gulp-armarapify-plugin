import { TokenIterator } from './../tokenIterator';
import { Token } from './../tokens/token';
import { tokenTypes } from './../tokens/tokenTypes';
import { NodeError } from './../nodeError';

export class ReaderUtility {
    private _iterator: TokenIterator;
    private _expectedTokenTypes: string[] | null;
    private _ignoreTokenTypes: string[] | null;

    constructor(iterator: TokenIterator) {
        this._iterator = iterator;
        this._resetDefaults();
    }

    _resetDefaults(): void {
        this._expectedTokenTypes = null;
        this._ignoreTokenTypes = null;
    }

    expectTokens(...expected: string[]): this {
        this._expectedTokenTypes = expected;
        return this;
    }

    ignoreTokens(...ignored: string[]): this {
        this._ignoreTokenTypes = ignored;
        return this;
    }

    nextToken(errorDescription: string): Token<string | number> {
        if (!this._expectedTokenTypes) {
            this._resetDefaults();
            throw new Error('The expectedTokens have not been configured. Call the expectTokens() method before this one.');
        }

        const eof = this.moveToNextTokenOrEof(errorDescription);
        if (eof) {
            this._resetDefaults();
            throw new NodeError(`${errorDescription} expected but got EOF`, this._iterator.line, this._iterator.column);
        }

        const current = this._iterator.current;
        if (this._expectedTokenTypes.indexOf(current.tokenType) < 0) {
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
            case tokenTypes.cr: { value = '#13'; break; }
            case tokenTypes.lf: { value = '#10'; break; }
            default: { value = token.tokenValue; }
        }

        return value;
    }

    moveToNextTokenOrEof(errorDescription: string): boolean {
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
}