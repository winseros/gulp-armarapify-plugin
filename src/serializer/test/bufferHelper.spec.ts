import { BufferHelper } from '../bufferHelper';

describe('serializer/bufferHelper', () => {
    describe('writeAsciiString', () => {
        it('should fullfill a buffer using data and offset', () => {
            const buffer = Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
            BufferHelper.writeAsciiString(buffer, 2, 'aaaaaa');

            const expected = [0xff, 0xff, 0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x00, 0xff, 0xff];
            expect(buffer).toEqual(Buffer.from(expected));
        });
    });

    describe('writeCompressedInt', () => {
        it('should fullfill a buffer using data and offset', () => {
            const buffer = Buffer.alloc(5, 0);
            BufferHelper.writeCompressedInt(buffer, 0, 257);

            const expected = [0xff, 0xff, 0x03, 0x00, 0x00];
            expect(buffer).toEqual(Buffer.from(expected));
        });
    });

    describe('getCompressedIntLength', () => {
        it('should fullfill a buffer using data and offset', () => {
            const length = BufferHelper.getCompressedIntLength(257);
            expect(length).toEqual(3);
        });
    });
});
