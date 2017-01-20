import { Packet } from './packet';
import { PacketBase } from './packetBase';
import { PacketType } from './packetType';
import { DataType } from './dataType';
import { BufferHelper } from '../bufferHelper';

export class StringPacket extends PacketBase {
    private _tokenName: string;
    private _data: string;

    constructor(tokenName: string, data: string, prev: Packet) {
        super(prev);
        this._tokenName = tokenName;
        this._data = data;
    }

    get size(): number {
        return 1//packet type byte
            + 1//data type byte
            + this._tokenName.length + 1//class name + 0-terminator
            + this._data.length + 1;//data + 0-terminator
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