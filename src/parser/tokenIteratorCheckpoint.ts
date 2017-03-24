import { Checkpoint } from './iterator';
import { TokenIterator } from './tokenIterator';
import { CharIteratorCheckpoint } from './charIteratorCheckpoint';
import { Token } from './tokens/token';

export interface CheckpointParams {
    iterator: TokenIterator;
    checkpoint: CharIteratorCheckpoint;
    current: Token<string | number>;
    line: number;
    column: number;
    depleted: boolean;
}

export class TokenIteratorCheckpoint implements Checkpoint<Token<string | number>> {
    private _params: CheckpointParams;

    constructor(params: CheckpointParams) {
        this._params = params;
    }

    restore(): void {
        this._params.iterator.__rollbackCheckpoint(this._params);
    }

    createCheckpoint(): TokenIteratorCheckpoint {
        throw new Error('Not implemented');
    }

    moveNext(): boolean {
        const next = this._params.iterator.moveNext();
        return next;
    }

    get current(): Token<string | number> {
        return this._params.iterator.current;
    }

    get line(): number {
        return this._params.iterator.line;
    }

    get column(): number {
        return this._params.iterator.column;
    }

    get index(): number {
        return this._params.iterator.index;
    }

    get depleted(): boolean {
        return this._params.iterator.depleted;
    }
}