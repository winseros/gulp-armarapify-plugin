export interface Packet {
    next: Packet | undefined;
    bytes(): Buffer;
    readonly size: number;
    offset: number;
}