const _n127 = 0b01111111;
const _n128 = 0b10000000;

export class BufferHelper {
    static writeAsciiString(buffer: Buffer, offset: number, data: string): number {
        offset += buffer.write(data, offset);
        offset = buffer.writeUInt8(0, offset);
        return offset;
    }

    static writeCompressedInt(buffer: Buffer, offset: number, data: number): number {
        do {
            let current = data % _n128;
            data = Math.floor(data / _n128);
            if (data) { current = current | _n128; }
            offset = buffer.writeUInt8(current, offset);
        } while (data > _n127);

        if (data) {
            offset = buffer.writeUInt8(data, offset);
        }
        return offset;
    }

    static getCompressedIntLength(data: number): number {
        let size = 1;
        while (data > _n127) {
            data = Math.floor(data / _n128);
            size++;
        }
        return size;
    }
}