import { ClassNode } from '../parser/nodes/classNode';
import { Packet } from './packets/packet';
import { NodeExpander } from './nodeExpander';
import { PacketWriter } from './packetWriter';

export class TreeSerizlizer {
    private _expander = new NodeExpander();

    serialize(root: ClassNode): Buffer {
        const signaturePacket = this._expander.expandClass(root);
        const bufferSize = signaturePacket.last.offset + signaturePacket.last.size;

        const buf = Buffer.allocUnsafe(bufferSize);
        const writer = new PacketWriter(buf);

        let offset = 0;
        let packet: Packet | undefined = signaturePacket;
        while (packet) {
            offset = writer.writePacket(packet, offset);
            packet = packet.next;
        }

        if (bufferSize !== offset) {
            throw new Error(`The packets declared to use ${bufferSize} bytes buf have used only ${offset}`);
        }

        return buf;
    }
}