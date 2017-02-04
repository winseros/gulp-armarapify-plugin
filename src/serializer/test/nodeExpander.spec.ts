import { NodeExpander } from '../nodeExpander';
import { ClassNode } from '../../parser/nodes/classNode';
import { ExternNode } from '../../parser/nodes/externNode';
import { DeleteNode } from '../../parser/nodes/deleteNode';
import { PropertyNode } from '../../parser/nodes/propertyNode';
import { StringNode } from '../../parser/nodes/stringNode';
import { IntegerNode } from '../../parser/nodes/integerNode';
import { FloatNode } from '../../parser/nodes/floatNode';
import { WordNode } from '../../parser/nodes/wordNode';
import { ArrayNode } from '../../parser/nodes/arrayNode';
import { MathOpNode } from '../../parser/nodes/mathOpNode';
import { MathGrpNode } from '../../parser/nodes/mathGrpNode';
import { MathNegNode } from '../../parser/nodes/mathNegNode';
import { mathOperators } from '../../mathOperators';
import { Packet } from '../packets/packet';
import { SignaturePacket } from '../packets/signaturePacket';
import { ClassPacket } from '../packets/classPacket';
import { ClassBodyPacket } from '../packets/classBodyPacket';
import { ExternPacket } from '../packets/externPacket';
import { DeletePacket } from '../packets/deletePacket';
import { PointerPacket } from '../packets/pointerPacket';
import { StringPacket } from '../packets/stringPacket';
import { FloatPacket } from '../packets/floatPacket';
import { IntegerPacket } from '../packets/integerPacket';
import { ArrayPacket } from '../packets/arrayPacket';
import { WordPacket } from '../packets/wordPacket';
import { EnumsPacket } from '../packets/enumsPacket';

describe('serializer/nodeExpander', () => {
    describe('expandNode', () => {
        it('should expand a class with internal objects', () => {
            const root = new ClassNode('', []);
            root.children.push(new PropertyNode('prop1', new StringNode('prop1Value')));
            root.children.push(new PropertyNode('prop2', new IntegerNode(1)));
            root.children.push(new PropertyNode('prop3', new FloatNode(1.5)));
            root.children.push(new PropertyNode('prop4', new MathOpNode(
                mathOperators.plus,
                new IntegerNode(1),
                new IntegerNode(1)
            )));
            root.children.push(new PropertyNode('prop5', new MathOpNode(
                mathOperators.plus,
                new FloatNode(1.5),
                new FloatNode(1.5)
            )));
            root.children.push(new ClassNode('InnerClass', [
                new PropertyNode('innerProp1', new StringNode('innerProp1val')),
                new PropertyNode('innerProp2', new StringNode('innerProp2val')),
            ]));
            root.children.push(new ClassNode('EmptyClass', []));
            root.children.push(new PropertyNode('prop6', new ArrayNode([
                new IntegerNode(1),
                new FloatNode(1.5),
                new MathNegNode(new FloatNode(2.5)),
                new ArrayNode([
                    new StringNode('prop5string')
                ]),
                new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2)),
                new MathGrpNode(new StringNode('prop6string')),
                new WordNode('prop7word')
            ])));
            root.children.push(new ExternNode('BaseClass'));
            root.children.push(new DeleteNode('NotAClass'));
            root.children.push(new PropertyNode('prop8', new MathNegNode(new IntegerNode(10))));
            root.children.push(new PropertyNode('prop9', new WordNode('a-word')));

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

            //BaseClass packet
            packet = packet.next!;
            expect(packet instanceof ExternPacket).toBeTruthy();

            //NotAClass packet
            packet = packet.next!;
            expect(packet instanceof DeletePacket).toBeTruthy();

            //prop8 packet
            packet = packet.next!;
            expect(packet instanceof IntegerPacket).toBeTruthy();

            //prop9 packet
            packet = packet.next!;
            expect(packet instanceof WordPacket).toBeTruthy();

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

        it('should throw if class contains unexpected child', () => {
            const root = new ClassNode('', []);
            root.children.push(new StringNode('prop1Value'));

            const expander = new NodeExpander();
            expect(() => expander.expandClass(root)).toThrowError(`Unexpected class child of type "${root.children[0].type}"`);
        });

        it('should throw if property contains unexpected data', () => {
            const root = new ClassNode('', []);
            const prop = new PropertyNode('prop2', new StringNode('prop1Value'));
            root.children.push(new PropertyNode('prop1', prop));

            const expander = new NodeExpander();
            expect(() => expander.expandClass(root)).toThrowError(`Unexpected property value of type "${prop.type}"`);
        });

        it('should throw if array contains unexpected data', () => {
            const root = new ClassNode('', []);
            const prop = new PropertyNode('prop2', new StringNode('prop1Value'));
            root.children.push(new PropertyNode('prop1', new ArrayNode([prop])));

            const expander = new NodeExpander();
            expect(() => expander.expandClass(root)).toThrowError(`Unexpected array element of type "${prop.type}"`);
        });
    });
});
