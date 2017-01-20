import { ClassNode } from '../parser/nodes/classNode';
import { PropertyNode } from '../parser/nodes/propertyNode';
import { NumberNode } from '../parser/nodes/numberNode';
import { StringNode } from '../parser/nodes/stringNode';
import { ArrayNode } from '../parser/nodes/arrayNode';
import { nodeTypes } from '../parser/nodes/nodeTypes';
import { Packet } from './packets/packet';
import { SignaturePacket } from './packets/signaturePacket';
import { EnumsPacket } from './packets/enumsPacket';
import { ClassBodyPacket } from './packets/classBodyPacket';
import { ClassPacket } from './packets/classPacket';
import { StringPacket } from './packets/stringPacket';
import { FloatPacket } from './packets/floatPacket';
import { IntegerPacket } from './packets/integerPacket';
import { ArrayPacket } from './packets/arrayPacket';
import {
    ArrayElement,
    ArrayStruct,
    ArrayElementString,
    ArrayElementInteger,
    ArrayElementFloat
} from './packets/arrayElement';
import { ExpressionResolver } from './expressionResolver';

export class NodeExpander {
    private _resolver = new ExpressionResolver();

    expandClass(node: ClassNode): SignaturePacket {
        const startPacket = new SignaturePacket();
        const lastDataPacket = this._expandClassBody(startPacket, node);
        startPacket.last = new EnumsPacket(lastDataPacket);
        return startPacket;
    }

    _expandClassBody(packet: Packet, node: ClassNode): Packet {
        type Tupple = { packet: ClassPacket, node: ClassNode };

        packet = this._expandClass(packet, node);
        const pool = [{ packet, node }] as Tupple[];

        while (pool.length) {
            const tupple = pool.shift() !;

            const children = tupple.node.children;
            for (let i = 0; i < children.length; i++) {
                if (i === 0) {
                    packet = tupple.packet.firstChild = new ClassBodyPacket(tupple.node.inherits, children.length, packet);
                }
                const child = children[i];
                switch (child.type) {
                    case nodeTypes.class: {
                        packet = this._expandClass(packet, child as ClassNode);
                        pool.push({ packet: packet as ClassPacket, node: child as ClassNode });
                        break;
                    }
                    case nodeTypes.property: {
                        packet = this._expandProperty(packet, child as PropertyNode);
                        break;
                    }
                }
            }
        }

        return packet;
    }

    _expandClass(packet: Packet, node: ClassNode): Packet {
        packet = new ClassPacket(node.className, node.inherits, packet);
        return packet;
    }

    _expandProperty(packet: Packet, node: PropertyNode): Packet {
        const value = node.value;
        switch (value.type) {
            case nodeTypes.number: {
                packet = this._expandNumber(packet, node);
                break;
            }
            case nodeTypes.string: {
                packet = this._expandString(packet, node);
                break;
            }
            case nodeTypes.array: {
                packet = this._expandArray(packet, node);
                break;
            }
            case nodeTypes.mathOp:
            case nodeTypes.mathGrp: {
                packet = this._expandExpression(packet, node);
                break;
            }
        }
        return packet;
    }

    _expandNumber(packet: Packet, node: PropertyNode): Packet {
        const number = node.value as NumberNode;
        packet.next = number.isFloat ? new FloatPacket(node.name, number.value, packet) : new IntegerPacket(node.name, number.value, packet);
        return packet.next;
    }

    _expandString(packet: Packet, node: PropertyNode): Packet {
        const string = node.value as StringNode;
        packet.next = new StringPacket(node.name, string.value, packet);
        return packet.next;
    }

    _expandArray(packet: Packet, node: PropertyNode): Packet {
        const arrayStruct = this._expandArrayContents(node.value as ArrayNode);
        packet = new ArrayPacket(node.name, arrayStruct, packet);
        return packet;
    }

    _expandArrayContents(node: ArrayNode): ArrayStruct {
        const elements = [] as ArrayElement[];
        for (let child of node.value) {
            switch (child.type) {
                case nodeTypes.string: {
                    const strNode = child as StringNode;
                    elements.push(new ArrayElementString(strNode.value));
                    break;
                }
                case nodeTypes.number: {
                    const numNode = child as NumberNode;
                    const numElement = numNode.isFloat ? new ArrayElementFloat(numNode.value) : new ArrayElementInteger(numNode.value);
                    elements.push(numElement);
                    break;
                }
                case nodeTypes.array: {
                    const arrayElement = this._expandArrayContents(child as ArrayNode);
                    elements.push(arrayElement);
                    break;
                }
            }
        }
        return new ArrayStruct(elements);
    }

    _expandExpression(packet: Packet, node: PropertyNode): Packet {
        const number = this._resolver.resolve(node);
        packet = number.isFloat ? new FloatPacket(node.name, number.value, packet) : new IntegerPacket(node.name, number.value, packet);
        return packet;
    }
}