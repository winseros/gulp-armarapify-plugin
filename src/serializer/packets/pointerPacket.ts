import { Packet } from './packet';
import { PacketBase } from './packetBase';

export class PointerPacket extends PacketBase {
    constructor(prev: Packet) {
        super(prev);
    }

    get size(): number {
        return 4;
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        buf.writeInt32LE(this.next.offset, 0);
        return buf;
    }
}