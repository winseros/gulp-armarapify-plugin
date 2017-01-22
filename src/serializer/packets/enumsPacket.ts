import { PacketBase } from './packetBase';

export class EnumsPacket extends PacketBase {

    get size(): number {
        return 4;
    }

    bytes(): Buffer {
        return Buffer.alloc(this.size);
    }
}