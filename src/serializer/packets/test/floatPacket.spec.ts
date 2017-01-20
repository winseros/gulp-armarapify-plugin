import { Packet } from '../packet';
import { FloatPacket } from '../floatPacket';
import { PacketType } from '../packetType';
import { DataType } from '../dataType';

describe('serializer/packets/floatPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new FloatPacket('some-name', 1, {} as Packet);
            expect(packet.size).toEqual(16);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new FloatPacket('some-name', 1, {} as Packet);

            const bytes = packet.bytes();

            const expected = [
                PacketType.tokenName, DataType.float,
                0x73, 0x6f, 0x6d, 0x65, 0x2d, 0x6e, 0x61, 0x6d, 0x65, 0x00,
                0x00, 0x00, 0x80, 0x3f
            ];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});