import { Packet } from '../packet';
import { PointerPacket } from '../pointerPacket';

describe('serializer/packets/pointerPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new PointerPacket();
            expect(packet.size).toEqual(4);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new PointerPacket();
            packet.next = { offset: 0x00bbccdd } as Packet;

            const bytes = packet.bytes();

            const expected = [0xdd, 0xcc, 0xbb, 0x00];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});