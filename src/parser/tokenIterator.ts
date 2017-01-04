import { ReaderRegistry } from './tokens/readerRegistry';
import { Checkpoint, Iterator } from './iterator';
import { CharIterator } from './charIterator';
import { Token } from './tokens/token';

const regexSpace = /[\s^\r\n]/;

export class TokenIterator implements Iterator<Token<string | number>> {
    private _readerRegistry = ReaderRegistry.instance;
    private _iterator: CharIterator;
    private _current: Token<string | number>;
    private _line: number;
    private _column: number;
    private _depleted: boolean;

    constructor(buffer: Buffer) {
        this._iterator = new CharIterator(buffer);
        this._depleted = this._iterator.depleted;
    }

    moveNext(): boolean {
        const isDepleted = this._updateDepleted();
        if (isDepleted) {
            return false;
        } else {
            const hasMoreSymbols = this._skipWhitespace();
            if (hasMoreSymbols) {
                const token = this._readNextToken();
                this._current = token;
                this._line = token.lineNumber;
                this._column = token.colNumber;
            } else {
                this._updateDepleted();
            }
            return hasMoreSymbols;
        }
    }

    get current(): Token<string | number> {
        return this._current;
    }

    get depleted(): boolean {
        return this._depleted;
    }

    get line(): number {
        return this._line;
    }

    get column(): number {
        return this._column;
    }

    _updateDepleted(): boolean {
        if (this._iterator.depleted) {
            this._depleted = true;
        }
        return this._depleted;
    }

    _skipWhitespace(): boolean {
        while (TokenIterator._isWhitespace(this._iterator)) {
            if (!this._iterator.moveNext()) {
                return false;
            }
        }
        return true;
    }

    _readNextToken(): Token<string | number> {
        const reader = this._readerRegistry.pickReader(this._iterator);
        const token = reader.read(this._iterator);
        return token;
    }

    static _isWhitespace(iterator: Iterator<any>): boolean {
        const current = iterator.current;
        if (!current) {
            return true;
        } else if (current === '\r' || current === '\n') {
            return false;
        }

        const match = regexSpace.test(current);
        return match;
    }

    createCheckpoint(): Checkpoint<Token<string | number>> {
        throw new Error('Not implemented');
    }
}