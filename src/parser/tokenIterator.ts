import { ReadersCollection } from './tokens/readersCollection';
import { Checkpoint, Iterator } from './iterator';
import { CharIterator } from './charIterator';
import { Token } from './tokens/token';

export class TokenIterator implements Iterator<Token<string | number>> {
    private _readersCollection = ReadersCollection.instance;
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
            this._current = this._readersCollection.read(this._iterator);
            this._line = this._current.lineNumber;
            this._column = this._current.colNumber;
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

    createCheckpoint(): Checkpoint<Token<string | number>> {
        throw new Error('Not implemented');
    }
}