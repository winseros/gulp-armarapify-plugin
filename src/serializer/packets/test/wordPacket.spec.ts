import { Packet } from '../packet';
import { WordPacket } from '../wordPacket';
import { PacketType } from '../packetType';
import { DataType } from '../dataType';

describe('serializer/packets/wordPacket', () => {
    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            const packet = new WordPacket('some-name', 'some-value', {} as Packet);

            const bytes = packet.bytes();

            const expected = [
                PacketType.tokenName, DataType.word,
                0x73, 0x6f, 0x6d, 0x65, 0x2d, 0x6e, 0x61, 0x6d, 0x65, 0x00,
                0x73, 0x6f, 0x6d, 0x65, 0x2d, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x00
            ];
            expect(bytes).toEqual(Buffer.from(expected));
        });
    });
});