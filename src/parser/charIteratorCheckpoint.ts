import {Checkpoint} from './iterator';
import {CharIterator} from './charIterator';

export interface CheckpointParams {
    iterator: CharIterator;
    bufferIndex: number;
    line: number;
    column: number;
    depleted: boolean;
}

export class CharIteratorCheckpoint implements Checkpoint<string> {
    private _params: CheckpointParams;

    constructor(params: CheckpointParams) {
        this._params = params;
    }

    restore(): void {
        this._params.iterator.__rollbackCheckpoint(this._params);
    }

    createCheckpoint(): CharIteratorCheckpoint {
        throw new Error('Not implemented');
    }

    moveNext(): boolean {
        const next = this._params.iterator.moveNext();
        return next;
    }

    get current(): string {
        return this._params.iterator.current;
    }

    get line(): number {
        return this._params.iterator.line;
    }

    get column(): number {
        return this._params.iterator.column;
    }

    get depleted(): boolean {
        return this._params.iterator.depleted;
    }
}