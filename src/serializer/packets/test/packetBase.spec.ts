import { Packet } from '../packet';
import { PacketBase } from '../packetBase';

class MockPacket extends PacketBase {
    bytes(): Buffer {
        return {} as Buffer;
    }

    get size(): number {
        return 10;
    };
}

describe('serializer/packets/packetBase', () => {
    describe('offset', () => {
        it('should return a valid offset', () => {
            const prev = { size: 101, offset: 700 } as Packet;
            const p = new MockPacket(prev);

            expect(p.offset).toEqual(801);

            //change the prev data now to check caching
            (prev as any).offset = 1;//never gonna happen in real
            (prev as any).size = 2;

            expect(p.offset).toEqual(801);//cached value
        });
    });
});
