import { TreeSerizlizer } from '../treeSerializer';
import { NodeExpander } from '../nodeExpander';
import { Packet } from '../packets/packet';
import { SignaturePacket } from '../packets/signaturePacket';
import { ClassNode } from '../../parser/nodes/classNode';

describe('serializer/treeSerializer', () => {
    describe('serialize', () => {
        it('should serialize a tree', () => {
            const p1 = { size: 5, bytes: () => Buffer.from([0x01, 0x01, 0x01, 0x01, 0x01]) } as SignaturePacket;
            const p2 = p1.next = { size: 7, bytes: () => Buffer.from([0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02]) } as Packet;
            p2.next = p1.last = { offset: 12, size: 11, bytes: () => Buffer.from([0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03]) } as Packet;

            spyOn(NodeExpander.prototype, 'expandClass').and.returnValue(p1);

            const root = new ClassNode('a-class-name', []);

            const serializer = new TreeSerizlizer();
            const buf = serializer.serialize(root);

            expect(NodeExpander.prototype.expandClass).toHaveBeenCalledTimes(1);
            expect(NodeExpander.prototype.expandClass).toHaveBeenCalledWith(root);

            const expected = [
                0x01, 0x01, 0x01, 0x01, 0x01,
                0x02, 0x02, 0x02, 0x02, 0x02, 0x02, 0x02,
                0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03
            ];
            expect(buf).toEqual(Buffer.from(expected));
        });

        it('should throw if the buffer size was calculated incorrectly', () => {
            const p1 = { size: 1, bytes: () => Buffer.from([0x01]) } as SignaturePacket;
            const p2 = p1.next = { size: 1, bytes: () => Buffer.from([0x02]) } as Packet;
            p2.next = p1.last = { offset: 12, size: 1, bytes: () => Buffer.from([0x03]) } as Packet;//offset is wrong here

            spyOn(NodeExpander.prototype, 'expandClass').and.returnValue(p1);
            spyOn(TreeSerizlizer.prototype, '_inflateOffsets').and.returnValue(p1.last.offset + p1.last.size);

            const root = new ClassNode('a-class-name', []);

            const serializer = new TreeSerizlizer();
            expect(() => serializer.serialize(root)).toThrowError('The packets declared to use 13 bytes buf have used only 3');
        });
    });
});
