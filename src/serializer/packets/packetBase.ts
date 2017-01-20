import { Packet } from './packet';

export abstract class PacketBase implements Packet {
    private _prev: Packet;
    private _offset: number;

    constructor(prev: Packet) {
        this._prev = prev;
    }

    next: Packet;

    abstract bytes(): Buffer;

    abstract get size(): number;

    get offset(): number {
        if (!this._offset) {
            this._offset = this._prev.offset + this._prev.size;
        }
        return this._offset;
    }
}