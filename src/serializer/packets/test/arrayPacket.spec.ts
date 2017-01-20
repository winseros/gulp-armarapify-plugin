import { Packet } from '../packet';
import { ArrayPacket } from '../arrayPacket';
import { PacketType } from '../packetType';
import { BufferHelper } from '../../bufferHelper';

describe('serializer/packets/arrayPacket', () => {
    describe('size', () => {
        it('should return a valid packet size', () => {
            const e1 = jasmine.createSpyObj('ArrayStruct', ['a']);
            e1.size = 3;

            const packet = new ArrayPacket('arrayName', e1, {} as Packet);
            expect(packet.size).toEqual(14);
        });
    });

    describe('bytes', () => {
        it('should return a fulfilled buffer', () => {
            spyOn(BufferHelper, 'writeAsciiString').and.callThrough();

            const bytes = Buffer.from([0x01, 0x02, 0x03]);

            const e1 = jasmine.createSpyObj('ArrayStruct', ['getBytes']);
            e1.size = bytes.length;

            const getBytes = e1.getBytes as jasmine.Spy;
            getBytes.and.returnValue(bytes);

            const packet = new ArrayPacket('arrayName', e1, {} as Packet);
            const packetBytes = packet.bytes();

            const expected = [
                PacketType.array,
                0x61, 0x72, 0x72, 0x61, 0x79, 0x4e, 0x61, 0x6d, 0x65, 0x00,
                0x01, 0x02, 0x03
            ];
            expect(packetBytes).toEqual(Buffer.from(expected));

            expect(BufferHelper.writeAsciiString).toHaveBeenCalledTimes(1);
            expect(BufferHelper.writeAsciiString).toHaveBeenCalledWith(packetBytes, 1, 'arrayName');
        });
    });
});
