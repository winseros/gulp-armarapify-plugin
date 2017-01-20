import { Packet } from './packet';
import { PacketBase } from './packetBase';
import { PacketType } from './packetType';
import { ArrayStruct } from './arrayElement';
import { BufferHelper } from '../bufferHelper';

export class ArrayPacket extends PacketBase {
    private _tokenName: string;
    private _data: ArrayStruct;

    constructor(tokenName: string, data: ArrayStruct, prev: Packet) {
        super(prev);
        this._tokenName = tokenName;
        this._data = data;
    }

    get size(): number {
        return 1//packet type byte
            + this._tokenName.length + 1//class name + 0-terminator
            + this._data.size;
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        let offset = buf.writeUInt8(PacketType.array, 0);
        offset = BufferHelper.writeAsciiString(buf, offset, this._tokenName);

        const bytes = this._data.getBytes();
        bytes.copy(buf, offset);

        return buf;
    }
}
