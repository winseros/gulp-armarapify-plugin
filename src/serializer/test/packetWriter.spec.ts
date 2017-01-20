import { Packet } from '../packets/packet';
import { PacketWriter } from '../packetWriter';

describe('serializer/packetWriter', () => {
    describe('writePacket', () => {
        it('should throw if actual bytes length differs from packet.size', () => {
            const buf = Buffer.allocUnsafe(10);
            const writer = new PacketWriter(buf);

            const packet = { size: 10, bytes: () => Buffer.allocUnsafe(11) } as Packet;

            expect(() => writer.writePacket(packet, 0)).toThrowError('The packet declared its size of 10 bytes, but the actual data size was 11 bytes');
        });

        it('should throw if couldn`t copy all the packet bytes to the buffer', () => {
            const buf = Buffer.allocUnsafe(5);
            const writer = new PacketWriter(buf);

            const packet = { size: 10, bytes: () => Buffer.allocUnsafe(10) } as Packet;

            expect(() => writer.writePacket(packet, 0)).toThrowError('Couldn`t copy all the paket data to the buffer');
        });

        it('should copy the packet data to the buffer', () => {
            const buf = Buffer.alloc(10);
            const writer = new PacketWriter(buf);

            const packet = { size: 5, bytes: () => Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]) } as Packet;
            const offset = writer.writePacket(packet, 1);

            expect(offset).toEqual(6);

            const expected = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x00, 0x00, 0x00, 0x00];

            expect(buf).toEqual(Buffer.from(expected));
        });
    });
});
