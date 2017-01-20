import { Packet } from './packet';
import { NumberPacket } from './numberPacket';
import { DataType } from './dataType';

export class IntegerPacket extends NumberPacket {
    constructor(tokenName: string, data: number, prev: Packet) {
        super(tokenName, data, prev);
    }

    get _dataSize(): number {
        return 4;
    }

    _writeDataType(buffer: Buffer, offset: number): number {
        offset = buffer.writeUInt8(DataType.integer, offset);
        return offset;
    }

    _writeData(buffer: Buffer, offset: number): number {
        offset = buffer.writeInt32LE(this._data, offset);
        return offset;
    }
}