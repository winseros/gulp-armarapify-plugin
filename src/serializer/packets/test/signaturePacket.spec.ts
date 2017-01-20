import { Packet } from '../packet';
import { SignaturePacket } from '../signaturePacket';

describe('serializer/packets/signaturePacket', () => {
    describe('size', () => {
        it('should return a valid size', () => {
            const packet = new SignaturePacket();
            expect(packet.size).toEqual(16);
        });
    });

    describe('offset', () => {
        it('should return a valid size', () => {
            const packet = new SignaturePacket();
            expect(packet.offset).toEqual(0);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new SignaturePacket();
            packet.last = { offset: 100500 } as Packet;

            const bytes = packet.bytes();
            const expected = [
                0x00, 0x72, 0x61, 0x50,
                0x00, 0x00, 0x00, 0x00,
                0x08, 0x00, 0x00, 0x00,
                0x94, 0x88, 0x01, 0x00
            ];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});
