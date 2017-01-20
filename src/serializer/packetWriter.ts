import { Packet } from './packets/packet';

export class PacketWriter {
    private _buffer: Buffer;

    constructor(buffer: Buffer) {
        this._buffer = buffer;
    }

    writePacket(data: Packet, offset: number): number {
        const bytes = data.bytes();
        if (bytes.length !== data.size) {
            throw new Error(`The packet declared its size of ${data.size} bytes, but the actual data size was ${bytes.length} bytes`);
        }

        const copied = bytes.copy(this._buffer, offset);
        if (copied !== bytes.length) {
            throw new Error('Couldn`t copy all the paket data to the buffer');
        }

        offset += copied;
        return offset;
    }
}