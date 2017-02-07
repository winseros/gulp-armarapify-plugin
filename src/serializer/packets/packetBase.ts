import { Packet } from './packet';

export abstract class PacketBase implements Packet {
    next: Packet;

    abstract bytes(): Buffer;

    abstract get size(): number;

    offset: number;
}