import { Packet } from '../packet';
import { ClassBodyPacket } from '../classBodyPacket';

describe('serializer/packets/classBodyPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new ClassBodyPacket('inherits-class', 257, {} as Packet);
            expect(packet.size).toEqual(17);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new ClassBodyPacket('inherits-class', 257, {} as Packet);

            const bytes = packet.bytes();

            const expected = [
                0x69, 0x6e, 0x68, 0x65, 0x72, 0x69, 0x74, 0x73, 0x2d, 0x63, 0x6c, 0x61, 0x73, 0x73, 0x00,
                0x81, 0x02];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});