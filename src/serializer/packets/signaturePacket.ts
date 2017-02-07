import { Packet } from './packet';
import { PacketBase } from './packetBase';

export class SignaturePacket extends PacketBase {
    last: Packet;

    get size(): number {
        return 16;
    }

    bytes(): Buffer {
        const buf = Buffer.alloc(this.size);
        let offset = buf.writeInt32BE(0x00726150, 0);//0raP
        offset = buf.writeInt32LE(0, offset);
        offset = buf.writeInt32LE(8, offset);
        offset = buf.writeInt32LE(this.last.offset, offset);
        return buf;
    }
}