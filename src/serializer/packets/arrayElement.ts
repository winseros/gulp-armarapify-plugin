import { DataType } from './dataType';
import { BufferHelper } from '../bufferHelper';

export interface ArrayElement {
    getBytes(): Buffer;

    readonly size: number;
}

export class ArrayStruct implements ArrayElement {
    private _elements: ArrayElement[];

    constructor(elements: ArrayElement[]) {
        this._elements = elements;
    }

    get size(): number {
        const intLength = BufferHelper.getCompressedIntLength(this._elements.length);
        const size = this._elements.reduce((summ, element) => summ + element.size, intLength);
        return size;
    }

    getBytes(): Buffer {
        const buffers = this._elements.map(e => e.getBytes());
        const result = Buffer.allocUnsafe(this.size);

        const dataOffset = BufferHelper.writeCompressedInt(result, 0, this._elements.length);

        buffers.reduce((offset, buffer) => {
            const copied = buffer.copy(result, offset);
            offset = offset + copied;
            return offset;
        }, dataOffset);

        return result;
    }
}

export class ArrayElementString implements ArrayElement {
    constructor(private _data: string) {
    }

    get size(): number {
        return 1 + this._data.length + 1;
    }

    get dataType(): number {
        return DataType.string;
    }

    getBytes(): Buffer {
        const buffer = Buffer.allocUnsafe(this.size);
        const offset = buffer.writeUInt8(this.dataType, 0);
        BufferHelper.writeAsciiString(buffer, offset, this._data);
        return buffer;
    }
}

export class ArrayElementFloat implements ArrayElement {
    constructor(private _data: number) {
    }

    get size(): number {
        return 1 + 4;
    }

    getBytes(): Buffer {
        const buffer = Buffer.allocUnsafe(this.size);
        const offset = buffer.writeUInt8(DataType.float, 0);
        buffer.writeFloatLE(this._data, offset);
        return buffer;
    }
}

export class ArrayElementInteger implements ArrayElement {
    constructor(private _data: number) {
    }

    get size(): number {
        return 1 + 4;
    }

    getBytes(): Buffer {
        const buffer = Buffer.allocUnsafe(this.size);
        const offset = buffer.writeUInt8(DataType.integer, 0);
        buffer.writeInt32LE(this._data, offset);
        return buffer;
    }
}

export class ArrayElementWord extends ArrayElementString {
    get dataType(): number {
        return DataType.word;
    }
}