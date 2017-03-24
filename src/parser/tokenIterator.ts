import { ReadersCollection } from './tokens/readersCollection';
import { Iterator } from './iterator';
import { CheckpointParams, TokenIteratorCheckpoint } from './tokenIteratorCheckpoint';
import { CharIterator } from './charIterator';
import { Token } from './tokens/token';

export class TokenIterator implements Iterator<Token<string | number>> {
    private _readersCollection = ReadersCollection.instance;
    private _iterator: CharIterator;
    private _current: Token<string | number>;
    private _line: number;
    private _column: number;
    private _index: number;
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
            this._index = this._current.index;
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

    get index(): number {
        return this._index;
    }

    _updateDepleted(): boolean {
        if (this._iterator.depleted) {
            this._depleted = true;
        }
        return this._depleted;
    }

    createCheckpoint(): TokenIteratorCheckpoint {
        const params = {
            iterator: this,
            checkpoint: this._iterator.createCheckpoint(),
            current: this._current,
            line: this._line,
            column: this._column,
            depleted: this._depleted
        } as CheckpointParams;

        return new TokenIteratorCheckpoint(params);
    }

    __rollbackCheckpoint(params: CheckpointParams): void {
        params.checkpoint.restore();

        this._current = params.current;
        this._line = params.line;
        this._column = params.column;
        this._depleted = params.depleted;
    }
}