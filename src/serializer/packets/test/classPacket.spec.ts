import { Packet } from '../packet';
import { ClassPacket } from '../classPacket';
import { PacketType } from '../packetType';

describe('serializer/packets/classPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new ClassPacket('a-class-name', 'nothing', {} as Packet);
            expect(packet.size).toEqual(18);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer with some class children', () => {
            const packet = new ClassPacket('a-class-name', 'nothing', {} as Packet);
            packet.firstChild = { offset: 100500 } as Packet;

            const bytes = packet.bytes();

            const expected = [
                PacketType.className,
                0x61, 0x2d, 0x63, 0x6c, 0x61, 0x73, 0x73, 0x2d, 0x6e, 0x61, 0x6d, 0x65, 0x00,
                0x94, 0x88, 0x01, 0x00
            ];

            expect(bytes).toEqual(Buffer.from(expected));
        });

        it('should return a fulfilled buffer with no class children', () => {
            const packet = new ClassPacket('a-class-name', 'nothing', {} as Packet);

            const bytes = packet.bytes();

            const expected = [
                PacketType.className,
                0x61, 0x2d, 0x63, 0x6c, 0x61, 0x73, 0x73, 0x2d, 0x6e, 0x61, 0x6d, 0x65, 0x00,
                0x00, 0x00, 0x00, 0x00
            ];

            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});