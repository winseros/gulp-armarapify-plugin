import { Iterator } from './iterator';

const cr = 13;
const lf = 10;

export class CharIterator implements Iterator<string> {
    private _buffer: Buffer;
    private _bufferIndex = 0;
    private _depleted: boolean;
    private _current: string;
    private _line = 0;;
    private _column = 0;

    constructor(buffer: Buffer) {
        this._buffer = buffer;
        this._depleted = !buffer.length;
    }

    moveNext(): boolean {
        if (this._buffer.length > this._bufferIndex) {
            const current = this._peekOffsetByte(0);
            this._updatePosition(current);

            this._current = String.fromCharCode(current);
            this._bufferIndex++;
            return true;
        } else {
            this._depleted = true;
            return false;
        }
    }

    _updatePosition(current: number): void {
        if (this._bufferIndex > 0) {
            const prev = this._peekOffsetByte(-1);
            if (prev === lf || prev === cr && current !== lf) {
                this._column = 0;
                this._line++;
            } else {
                this._column++;
            }
        }
    }

    _peekOffsetByte(offset: number): number {
        const byte = this._buffer.readInt8(this._bufferIndex + offset);
        return byte;
    }

    get current(): string {
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
}