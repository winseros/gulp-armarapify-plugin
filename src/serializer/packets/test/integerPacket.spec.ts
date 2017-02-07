import { IntegerPacket } from '../integerPacket';
import { PacketType } from '../packetType';
import { DataType } from '../dataType';

describe('serializer/packets/integerPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new IntegerPacket('some-name', 1);
            expect(packet.size).toEqual(16);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new IntegerPacket('some-name', 168496141);

            const bytes = packet.bytes();

            const expected = [
                PacketType.tokenName, DataType.integer,
                0x73, 0x6f, 0x6d, 0x65, 0x2d, 0x6e, 0x61, 0x6d, 0x65, 0x00,
                0x0d, 0x0c, 0x0b, 0x0a
            ];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});