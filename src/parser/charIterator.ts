interface Iterator extends IterableIterator<number> {
    next(): Iterator;
    value: number;
    done: boolean;
}

export class CharIterator {
    private _iterator: Iterator;
    private _value: string;

    constructor(buffer: Buffer) {
        this._iterator = buffer.values() as Iterator;
    }

    next(): CharIterator {
        this._iterator.next();
        this._value = String.fromCharCode(this._iterator.value);
        return this;
    }

    get value(): string {
        return this._value;
    }

    get done(): boolean {
        return this._iterator.done;
    }
}