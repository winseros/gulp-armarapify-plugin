import { TokenReaders } from './tokens/tokenReaders';
import { Checkpoint, Iterator } from './iterator';
import { CharIterator } from './charIterator';
import { Token } from './tokens/token';

export class TokenIterator implements Iterator<Token<string | number>> {
    private _readerRegistry = TokenReaders.instance;
    private _iterator: CharIterator;
    private _current: Token<string | number>;
    private _line: number;
    private _column: number;
    private _depleted = false;

    constructor(buffer: Buffer) {
        this._iterator = new CharIterator(buffer);
        this._iterator.moveNext();

        this._updateDepleted();
    }

    moveNext(): boolean {
        const isDepleted = this._updateDepleted();
        if (isDepleted) {
            return false;
        } else {
            const token = this._readNextToken();
            this._current = token;
            this._line = token.lineNumber;
            this._column = token.colNumber;
            return true;
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

    _readNextToken(): Token<string | number> {
        const reader = this._readerRegistry.pickReader(this._iterator);
        const token = reader.read(this._iterator);
        return token;
    }

    createCheckpoint(): Checkpoint<Token<string | number>> {
        throw new Error('Not implemented');
    }
}