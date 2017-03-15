import { Packet } from './packet';
import { PacketBase } from './packetBase';
import { PacketType } from './packetType';
import { BufferHelper } from '../bufferHelper';

export class ClassPacket extends PacketBase {
    private _className: string;
    private _inherits: string;
    public firstChild?: Packet;

    constructor(className: string, inherits: string) {
        super();
        this._className = className;
        this._inherits = inherits;
    }

    get size(): number {
        return 1//packet type byte
            + Buffer.byteLength(this._className) + 1//class name + 0-terminator
            + 4;//offset to class body
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        let offset = buf.writeUInt8(PacketType.className, 0);
        offset = BufferHelper.writeAsciiString(buf, offset, this._className);
        buf.writeInt32LE(this.firstChild ? this.firstChild.offset : 0, offset);
        return buf;
    }
}