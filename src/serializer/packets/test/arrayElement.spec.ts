import { BufferHelper } from '../../bufferHelper';
import { DataType } from '../dataType';
import {
    ArrayElement,
    ArrayStruct,
    ArrayElementString,
    ArrayElementFloat,
    ArrayElementInteger
} from '../arrayElement';

class MockElement implements ArrayElement {
    constructor(private data: Buffer) { }

    get size(): number {
        return this.data.length;
    }

    getBytes(): Buffer {
        return this.data;
    }
}

describe('serializer/packets/arrayElement', () => {
    describe('ArrayStruct', () => {
        describe('size', () => {
            it('should return a correct struct size', () => {
                spyOn(BufferHelper, 'getCompressedIntLength').and.returnValue(5);

                const e1 = new MockElement(Buffer.from([0x41]));
                const e2 = new MockElement(Buffer.from([0x42, 0x42, 0x42]));
                const e3 = new MockElement(Buffer.from([0x43, 0x43, 0x43, 0x43, 0x43, 0x43, 0x43]));

                const struct = new ArrayStruct([e1, e2, e3]);

                expect(struct.size).toEqual(16);

                expect(BufferHelper.getCompressedIntLength).toHaveBeenCalledTimes(1);
                expect(BufferHelper.getCompressedIntLength).toHaveBeenCalledWith(3);
            });
        });

        describe('getBytes', () => {
            it('returns a fulfilled buffer', () => {
                spyOn(BufferHelper, 'getCompressedIntLength').and.returnValue(1);
                spyOn(BufferHelper, 'writeCompressedInt').and.callFake((buf: Buffer, offset: number) => buf.writeUInt8(255, offset));

                const e1 = new MockElement(Buffer.from([0x41]));
                const e2 = new MockElement(Buffer.from([0x42, 0x42, 0x42]));
                const e3 = new MockElement(Buffer.from([0x43, 0x43, 0x43, 0x43, 0x43, 0x43, 0x43]));

                const struct = new ArrayStruct([e1, e2, e3]);

                const bytes = struct.getBytes();

                const expected = [
                    0xff,
                    0x41,
                    0x42, 0x42, 0x42,
                    0x43, 0x43, 0x43, 0x43, 0x43, 0x43, 0x43
                ];
                expect(bytes).toEqual(Buffer.from(expected));

                expect(BufferHelper.writeCompressedInt).toHaveBeenCalledTimes(1);
                expect(BufferHelper.writeCompressedInt).toHaveBeenCalledWith(bytes, 0, 3);

                expect(BufferHelper.getCompressedIntLength).toHaveBeenCalledTimes(1);
                expect(BufferHelper.getCompressedIntLength).toHaveBeenCalledWith(3);
            });
        });
    });

    describe('ArrayElementString', () => {
        describe('size', () => {
            it('should return a correct element size', () => {
                const element = new ArrayElementString('some-text');
                expect(element.size).toEqual(11);
            });
        });

        describe('getBytes', () => {
            it('should return a fulfilled buffer', () => {
                const element = new ArrayElementString('some-text');
                const bytes = element.getBytes();

                const expected = [DataType.string, 0x73, 0x6f, 0x6d, 0x65, 0x2d, 0x74, 0x65, 0x78, 0x74, 0x00];
                expect(bytes).toEqual(Buffer.from(expected));
            });
        });
    });

    describe('ArrayElementFloat', () => {
        describe('size', () => {
            it('should return a correct element size', () => {
                const element = new ArrayElementFloat(1.0);
                expect(element.size).toEqual(5);
            });
        });

        describe('getBytes', () => {
            it('should return a fulfilled buffer', () => {
                const element = new ArrayElementFloat(1.0);
                const bytes = element.getBytes();

                const expected = [DataType.float, 0x00, 0x00, 0x80, 0x3f];
                expect(bytes).toEqual(Buffer.from(expected));
            });
        });
    });

    describe('ArrayElementInteger', () => {
        describe('size', () => {
            it('should return a correct element size', () => {
                const element = new ArrayElementInteger(1);
                expect(element.size).toEqual(5);
            });
        });

        describe('getBytes', () => {
            it('should return a fulfilled buffer', () => {
                const element = new ArrayElementInteger(168496141);
                const bytes = element.getBytes();

                const expected = [DataType.float, 0x0d, 0x0c, 0x0b, 0x0a];
                expect(bytes).toEqual(Buffer.from(expected));
            });
        });
    });
});
