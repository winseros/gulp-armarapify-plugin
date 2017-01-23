import { Packet } from '../packet';
import { ExternPacket } from '../externPacket';
import { PacketType } from '../packetType';

describe('serializer/packets/externPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new ExternPacket('a-class-name', {} as Packet);
            expect(packet.size).toEqual(14);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new ExternPacket('a-class-name', {} as Packet);

            const bytes = packet.bytes();

            const expected = [
                PacketType.extern,
                0x61, 0x2d, 0x63, 0x6c, 0x61, 0x73, 0x73, 0x2d, 0x6e, 0x61, 0x6d, 0x65, 0x00
            ];

            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});