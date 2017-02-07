import { PacketBase } from './packetBase';
import { BufferHelper } from '../bufferHelper';

export class ClassBodyPacket extends PacketBase {
    private _inherits: string;
    private _noOfChildren: number;

    constructor(inherits: string, noOfChildren: number) {
        super();
        this._inherits = inherits;
        this._noOfChildren = noOfChildren;
    }

    get size(): number {
        return this._inherits.length + 1
            + BufferHelper.getCompressedIntLength(this._noOfChildren);
    }

    bytes(): Buffer {
        const buf = Buffer.allocUnsafe(this.size);
        const offset = BufferHelper.writeAsciiString(buf, 0, this._inherits);
        BufferHelper.writeCompressedInt(buf, offset, this._noOfChildren);
        return buf;
    }
}