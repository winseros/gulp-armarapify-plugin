import { PacketBase } from './packetBase';
import { PacketType } from './packetType';
import { BufferHelper } from '../bufferHelper';

export class DeletePacket extends PacketBase {
    private _className: string;

    constructor(className: string) {
        super();
        this._className = className;
    }

    get size(): number {
        return 1//packet type byte
            + this._className.length + 1;//class name + 0-terminator
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        const offset = buf.writeUInt8(PacketType.delete, 0);
        BufferHelper.writeAsciiString(buf, offset, this._className);
        return buf;
    }
}