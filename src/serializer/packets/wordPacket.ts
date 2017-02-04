import { Packet } from './packet';
import { StringPacket } from './stringPacket';
import { PacketType } from './packetType';
import { DataType } from './dataType';
import { BufferHelper } from '../bufferHelper';

export class WordPacket extends StringPacket {
    constructor(tokenName: string, data: string, prev: Packet) {
        super(tokenName, data, prev);
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        let offset = buf.writeUInt8(PacketType.tokenName, 0);
        offset = buf.writeUInt8(DataType.word, offset);
        offset = BufferHelper.writeAsciiString(buf, offset, this._tokenName);
        BufferHelper.writeAsciiString(buf, offset, this._data);
        return buf;
    }
}