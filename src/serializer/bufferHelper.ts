const _7bitNumber = 0b01111111;

export class BufferHelper {
    static writeAsciiString(buffer: Buffer, offset: number, data: string): number {
        offset += buffer.write(data, offset);
        offset = buffer.writeUInt8(0, offset);
        return offset;
    }

    static writeCompressedInt(buffer: Buffer, offset: number, data: number): number {
        while (data > _7bitNumber) {
            offset = buffer.writeUInt8(0xff, offset);
            data -= _7bitNumber;
        }
        offset = buffer.writeUInt8(data, offset);
        return offset;
    }

    static getCompressedIntLength(data: number): number {
        let size = 1;
        while (data > _7bitNumber) {
            data -= _7bitNumber;
            size++;
        }
        return size;
    }
}