import { EnumsPacket } from '../enumsPacket';

describe('serializer/packets/enumsPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new EnumsPacket();
            expect(packet.size).toEqual(4);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new EnumsPacket();

            const bytes = packet.bytes();

            const expected = [
                0x00, 0x00, 0x00, 0x00
            ];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});