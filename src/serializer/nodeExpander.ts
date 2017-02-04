import { Node } from '../parser/nodes/node';
import { ClassNode } from '../parser/nodes/classNode';
import { ExternNode } from '../parser/nodes/externNode';
import { DeleteNode } from '../parser/nodes/deleteNode';
import { PropertyNode } from '../parser/nodes/propertyNode';
import { IntegerNode } from '../parser/nodes/integerNode';
import { FloatNode } from '../parser/nodes/floatNode';
import { StringNode } from '../parser/nodes/stringNode';
import { WordNode } from '../parser/nodes/wordNode';
import { ArrayNode } from '../parser/nodes/arrayNode';
import { nodeTypes } from '../parser/nodes/nodeTypes';
import { Packet } from './packets/packet';
import { SignaturePacket } from './packets/signaturePacket';
import { EnumsPacket } from './packets/enumsPacket';
import { ClassBodyPacket } from './packets/classBodyPacket';
import { ClassPacket } from './packets/classPacket';
import { ExternPacket } from './packets/externPacket';
import { DeletePacket } from './packets/deletePacket';
import { PointerPacket } from './packets/pointerPacket';
import { StringPacket } from './packets/stringPacket';
import { FloatPacket } from './packets/floatPacket';
import { IntegerPacket } from './packets/integerPacket';
import { ArrayPacket } from './packets/arrayPacket';
import {
    ArrayElement,
    ArrayStruct,
    ArrayElementString,
    ArrayElementInteger,
    ArrayElementFloat,
    ArrayElementWord
} from './packets/arrayElement';
import { ExpressionSerializer } from './expressionSerializer';
import { TreeError } from './treeError';

export class NodeExpander {
    private _serializer = new ExpressionSerializer();

    expandClass(node: ClassNode): SignaturePacket {
        const startPacket = new SignaturePacket();
        const lastDataPacket = this._expandClassBody(startPacket, node);
        lastDataPacket.next = startPacket.last = new EnumsPacket(lastDataPacket);
        return startPacket;
    }

    _expandClassBody(packet: Packet, node: ClassNode): Packet {
        type Tupple = { packet: ClassPacket, node: ClassNode };
        const pool = [{ packet, node }] as Tupple[];

        while (pool.length) {
            const tupple = pool.shift() !;

            const children = tupple.node.children;
            packet.next = packet = tupple.packet.firstChild = new ClassBodyPacket(tupple.node.inherits, children.length, packet);
            for (const child of children) {
                switch (child.type) {
                    case nodeTypes.class: {
                        packet = this._expandClass(packet, child as ClassNode);
                        pool.push({ packet: packet as ClassPacket, node: child as ClassNode });
                        break;
                    }
                    case nodeTypes.extern: {
                        packet = this._expandExtern(packet, child as ExternNode);
                        break;
                    }
                    case nodeTypes.delete: {
                        packet = this._expandDelete(packet, child as DeleteNode);
                        break;
                    }
                    case nodeTypes.property: {
                        const propNode = child as PropertyNode;
                        packet = this._expandProperty(packet, propNode.name, propNode.value);
                        break;
                    }
                    default: {
                        throw new TreeError(`Unexpected class child of type "${child.type}"`, child);
                    }
                }
            }
            packet.next = packet = new PointerPacket(packet);
        }

        return packet;
    }

    _expandClass(packet: Packet, node: ClassNode): Packet {
        packet.next = packet = new ClassPacket(node.className, node.inherits, packet);
        return packet;
    }

    _expandExtern(packet: Packet, node: ExternNode): Packet {
        packet.next = packet = new ExternPacket(node.className, packet);
        return packet;
    }

    _expandDelete(packet: Packet, node: DeleteNode): Packet {
        packet.next = packet = new DeletePacket(node.className, packet);
        return packet;
    }

    _expandProperty(packet: Packet, name: string, value: Node): Packet {
        switch (value.type) {
            case nodeTypes.integer: {
                const intNode = value as IntegerNode;
                packet = packet.next = new IntegerPacket(name, intNode.value, packet);
                break;
            }
            case nodeTypes.float: {
                const floatNode = value as FloatNode;
                packet = packet.next = new FloatPacket(name, floatNode.value, packet);
                break;
            }
            case nodeTypes.string: {
                const strNode = value as StringNode;
                packet = packet.next = new StringPacket(name, strNode.value, packet);
                break;
            }
            case nodeTypes.array: {
                const arrayStruct = this._expandArrayContents(value as ArrayNode);
                packet = packet.next = new ArrayPacket(name, arrayStruct, packet);
                break;
            }
            case nodeTypes.mathOp:
            case nodeTypes.mathGrp:
            case nodeTypes.mathNeg: {
                const resolved = this._serializer.serialize(value);
                packet = this._expandProperty(packet, name, resolved);
                break;
            }
            default: {
                throw new TreeError(`Unexpected property value of type "${value.type}"`, value);
            }
        }
        return packet;
    }

    _expandArrayContents(node: ArrayNode): ArrayStruct {
        const elements = node.value.map(this._expandArrayElement, this);
        return new ArrayStruct(elements);
    }

    _expandArrayElement(node: Node): ArrayElement {
        let element: ArrayElement;
        switch (node.type) {
            case nodeTypes.string: {
                const strNode = node as StringNode;
                element = new ArrayElementString(strNode.value);
                break;
            }
            case nodeTypes.integer: {
                const intNode = node as IntegerNode;
                element = new ArrayElementInteger(intNode.value);
                break;
            }
            case nodeTypes.float: {
                const fltNode = node as FloatNode;
                element = new ArrayElementFloat(fltNode.value);
                break;
            }
            case nodeTypes.array: {
                element = this._expandArrayContents(node as ArrayNode);
                break;
            }
            case nodeTypes.word: {
                const strNode = node as WordNode;
                element = new ArrayElementWord(strNode.value);
                break;
            }
            case nodeTypes.mathGrp:
            case nodeTypes.mathOp:
            case nodeTypes.mathNeg: {
                const resolved = this._serializer.serialize(node);
                element = this._expandArrayElement(resolved);
                break;
            }
            default: {
                throw new TreeError(`Unexpected array element of type "${node.type}"`, node);
            }
        }
        return element;
    }
}