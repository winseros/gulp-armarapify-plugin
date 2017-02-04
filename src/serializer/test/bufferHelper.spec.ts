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
        it('should write number 5', () => {
            const buffer = Buffer.alloc(5, 0);
            [
                { number: 5, expected: [0x05, 0x00, 0x00, 0x00, 0x00] },
                { number: 127, expected: [0x7f, 0x00, 0x00, 0x00, 0x00] },
                { number: 128, expected: [0x80, 0x01, 0x00, 0x00, 0x00] },
                { number: 129, expected: [0x81, 0x01, 0x00, 0x00, 0x00] },
                { number: 130, expected: [0x82, 0x01, 0x00, 0x00, 0x00] },
                { number: 255, expected: [0xff, 0x01, 0x00, 0x00, 0x00] },
                { number: 256, expected: [0x80, 0x02, 0x00, 0x00, 0x00] },
                { number: 300, expected: [0xac, 0x02, 0x00, 0x00, 0x00] }
            ].forEach(test => {
                buffer.fill(0);
                BufferHelper.writeCompressedInt(buffer, 0, test.number);
                expect(buffer).toEqual(Buffer.from(test.expected));
            });
        });
    });

    describe('getCompressedIntLength', () => {
        it('should fullfill a buffer using data and offset', () => {
            [
                { number: 5, expected: 1 },
                { number: 127, expected: 1 },
                { number: 128, expected: 2 },
                { number: 129, expected: 2 },
                { number: 130, expected: 2 },
                { number: 255, expected: 2 },
                { number: 256, expected: 2 },
                { number: 300, expected: 2 }
            ].forEach(test => {
                const length = BufferHelper.getCompressedIntLength(test.number);
                expect(length).toEqual(test.expected);
            });
        });
    });
});
