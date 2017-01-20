import { PacketBase } from './packetBase';

export class EnumsPacket extends PacketBase {

    get size(): number {
        return 8;
    }

    bytes(): Buffer {
        const buf = Buffer.alloc(this.size);
        let offset = buf.writeInt32LE(this.offset, 0);
        offset = buf.writeInt32LE(0, offset);
        return buf;
    }
}