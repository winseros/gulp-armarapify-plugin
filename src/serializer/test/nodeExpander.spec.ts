import { NodeExpander } from '../nodeExpander';
import { ClassNode } from '../../parser/nodes/classNode';
import { PropertyNode } from '../../parser/nodes/propertyNode';
import { StringNode } from '../../parser/nodes/stringNode';
import { NumberNode } from '../../parser/nodes/numberNode';
import { ArrayNode } from '../../parser/nodes/arrayNode';
import { MathOpNode } from '../../parser/nodes/mathOpNode';
import { mathOperators } from '../../mathOperators';
import { Packet } from '../packets/packet';
import { SignaturePacket } from '../packets/signaturePacket';
import { ClassPacket } from '../packets/classPacket';
import { ClassBodyPacket } from '../packets/classBodyPacket';
import { PointerPacket } from '../packets/pointerPacket';
import { StringPacket } from '../packets/stringPacket';
import { FloatPacket } from '../packets/floatPacket';
import { IntegerPacket } from '../packets/integerPacket';
import { ArrayPacket } from '../packets/arrayPacket';
import { EnumsPacket } from '../packets/enumsPacket';

describe('serializer/nodeExpander', () => {
    describe('expandNode', () => {
        it('should expand a class with internal objects', () => {
            const root = new ClassNode('', []);
            root.children.push(new PropertyNode('prop1', new StringNode('prop1Value')));
            root.children.push(new PropertyNode('prop2', new NumberNode(1, false)));
            root.children.push(new PropertyNode('prop3', new NumberNode(1.5, true)));
            root.children.push(new PropertyNode('prop4', new MathOpNode(
                mathOperators.plus,
                new NumberNode(1, false),
                new NumberNode(1, false)
            )));
            root.children.push(new PropertyNode('prop5', new MathOpNode(
                mathOperators.plus,
                new NumberNode(1.5, true),
                new NumberNode(1.5, true)
            )));
            root.children.push(new ClassNode('InnerClass', [
                new PropertyNode('innerProp1', new StringNode('innerProp1val')),
                new PropertyNode('innerProp2', new StringNode('innerProp2val')),
            ]));
            root.children.push(new ClassNode('EmptyClass', []));
            root.children.push(new PropertyNode('prop6', new ArrayNode([
                new NumberNode(1, false),
                new NumberNode(1.5, true),
                new ArrayNode([
                    new StringNode('prop5string')
                ])
            ])));

            const expander = new NodeExpander();
            const signaturePacket = expander.expandClass(root);
            let packet = signaturePacket as Packet;

            //signature packet
            expect(packet instanceof SignaturePacket).toBeTruthy();

            //root class body packet
            packet = packet.next!;
            expect(packet instanceof ClassBodyPacket).toBeTruthy();

            //prop1 packet
            packet = packet.next!;
            expect(packet instanceof StringPacket).toBeTruthy();

            //prop2 packet
            packet = packet.next!;
            expect(packet instanceof IntegerPacket).toBeTruthy();

            //prop3 packet
            packet = packet.next!;
            expect(packet instanceof FloatPacket).toBeTruthy();

            //prop4 packet
            packet = packet.next!;
            expect(packet instanceof IntegerPacket).toBeTruthy();

            //prop5 packet
            packet = packet.next!;
            expect(packet instanceof FloatPacket).toBeTruthy();

            //InnerClass packet
            packet = packet.next!;
            expect(packet instanceof ClassPacket).toBeTruthy();
            const innerClassPacket = packet as ClassPacket;

            //EmptyClass packet
            packet = packet.next!;
            expect(packet instanceof ClassPacket).toBeTruthy();
            const emptyClassPacket = packet as ClassPacket;

            //prop6 packet
            packet = packet.next!;
            expect(packet instanceof ArrayPacket).toBeTruthy();

            //pointer to the next packet
            packet = packet.next!;
            expect(packet instanceof PointerPacket).toBeTruthy();

            //InnerClass body packet
            packet = packet.next!;
            expect(packet instanceof ClassBodyPacket).toBeTruthy();
            expect(innerClassPacket.firstChild).toBe(packet);

            //innerProp1 packet
            packet = packet.next!;
            expect(packet instanceof StringPacket).toBeTruthy();

            //innerProp2 packet
            packet = packet.next!;
            expect(packet instanceof StringPacket).toBeTruthy();

            //pointer to the next packet
            packet = packet.next!;
            expect(packet instanceof PointerPacket).toBeTruthy();

            //EmptyClass body packet
            packet = packet.next!;
            expect(packet instanceof ClassBodyPacket).toBeTruthy();
            expect(emptyClassPacket.firstChild).toBe(packet);

            //pointer to the next packet
            packet = packet.next!;
            expect(packet instanceof PointerPacket).toBeTruthy();

            //enums packet
            packet = packet.next!;
            expect(packet instanceof EnumsPacket).toBeTruthy();
            expect(signaturePacket.last).toEqual(packet);
        });
    });
});
