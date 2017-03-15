import { PacketBase } from './packetBase';
import { PacketType } from './packetType';
import { DataType } from './dataType';
import { BufferHelper } from '../bufferHelper';

export class StringPacket extends PacketBase {
    protected readonly _tokenName: string;
    protected readonly _data: string;

    constructor(tokenName: string, data: string) {
        super();
        this._tokenName = tokenName;
        this._data = data;
    }

    get size(): number {
        return 1//packet type byte
            + 1//data type byte
            + Buffer.byteLength(this._tokenName) + 1//class name + 0-terminator
            + Buffer.byteLength(this._data) + 1;//data + 0-terminator
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        let offset = buf.writeUInt8(PacketType.tokenName, 0);
        offset = buf.writeUInt8(DataType.string, offset);
        offset = BufferHelper.writeAsciiString(buf, offset, this._tokenName);
        BufferHelper.writeAsciiString(buf, offset, this._data);
        return buf;
    }
}