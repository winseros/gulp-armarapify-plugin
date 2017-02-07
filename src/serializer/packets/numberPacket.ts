import { PacketBase } from './packetBase';
import { PacketType } from './packetType';
import { BufferHelper } from '../bufferHelper';

export abstract class NumberPacket extends PacketBase {
    private _tokenName: string;
    readonly _data: number;

    constructor(tokenName: string, data: number) {
        super();
        this._tokenName = tokenName;
        this._data = data;
    }

    get size(): number {
        return 1//packet type byte
            + 1//data type byte
            + this._tokenName.length + 1//token name + 0-terminator
            + this._dataSize;
    }

    abstract get _dataSize(): number;

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        let offset = buf.writeUInt8(PacketType.tokenName, 0);
        offset = this._writeDataType(buf, offset);
        offset = BufferHelper.writeAsciiString(buf, offset, this._tokenName);
        this._writeData(buf, offset);
        return buf;
    }

    abstract _writeDataType(buffer: Buffer, offset: number): number;

    abstract _writeData(buffer: Buffer, offset: number): number;
}