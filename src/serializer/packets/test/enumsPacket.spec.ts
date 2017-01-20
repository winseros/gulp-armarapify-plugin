import { Packet } from '../packet';
import { EnumsPacket } from '../enumsPacket';

describe('serializer/packets/enumsPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const packet = new EnumsPacket({} as Packet);
            expect(packet.size).toEqual(8);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {

        });
    });
});