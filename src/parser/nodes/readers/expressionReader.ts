import { Node } from '../node';
import { WordNode } from '../wordNode';
import { StringNode } from '../stringNode';
import { IntegerNode } from '../integerNode';
import { FloatNode } from '../floatNode';
import { MathGrpNode } from '../mathGrpNode';
import { MathOpNode } from '../mathOpNode';
import { nodeTypes } from '../nodeTypes';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { NodeError } from '../../nodeError';

export class ExpressionReader {
    private _reader: ReaderUtility;

    constructor(reader: ReaderUtility) {
        this._reader = reader;
    }

    readExpression(errorMesage: string, ...stopAt: string[]): Node {
        if (!stopAt.length) {
            throw new Error('A set of tokens to stop at must be specified');
        }

        let node = this._readNextNode();

        const iterator = this._reader.iterator;

        while (true) {
            this._reader.skip(tokenTypes.whitespace).moveToNextToken();

            if (stopAt.indexOf(iterator.current.tokenType) >= 0) {
                break;
            }

            if (iterator.current.tokenType === tokenTypes.newline) {
                throw new NodeError(`; expected at the end of the line`, iterator.line, iterator.column);
            } else if (iterator.current.tokenType !== tokenTypes.mathOp) {
                throw new NodeError(`Math operator expected but was "${iterator.current.tokenValue}" of type "${iterator.current.tokenType}"`, iterator.line, iterator.column);
            }

            const operator = iterator.current;

            this._reader.skip(tokenTypes.whitespace).moveToNextToken();
            const right = this._readNextNode();

            node = this._combineNodes(node, right, operator.tokenValue as string);
        }

        return node;
    }

    _combineNodes(node1: Node, node2: Node, mathOperator: string): Node {
        let node: Node;
        if (node1.type === nodeTypes.mathOp) {
            const mathOpNode = node1 as MathOpNode;
            const nodeWeight = this._getMathOpWeight(mathOpNode.operator);
            const newWeight = this._getMathOpWeight(mathOperator);
            if (newWeight > nodeWeight) {
                mathOpNode.right = new MathOpNode(mathOperator, mathOpNode.right, node2);
                node = mathOpNode;
            } else {
                node = new MathOpNode(mathOperator, node1, node2);
            }
        } else {
            node = new MathOpNode(mathOperator, node1, node2);
        }
        return node;
    }

    _readNextNode(): Node {
        let node: Node;

        const token = this._reader.iterator.current;
        switch (token.tokenType) {
            case tokenTypes.bracketOpen: {
                this._reader.skip(tokenTypes.whitespace).moveToNextToken();
                const body = this.readExpression(')', tokenTypes.bracketClose);
                node = new MathGrpNode(body);
                break;
            }
            case tokenTypes.string: {
                node = new StringNode(token.tokenValue as string);
                break;
            }
            case tokenTypes.word: {
                node = new WordNode(token.tokenValue as string);
                break;
            }
            case tokenTypes.float: {
                node = new FloatNode(token.tokenValue as number);
                break;
            }
            case tokenTypes.integer: {
                node = new IntegerNode(token.tokenValue as number);
                break;
            }
            default: {
                throw new NodeError(`Unexpected token "${token.tokenValue}" of type "${token.tokenType}"`, this._reader.iterator.line, this._reader.iterator.column);
            }
        }

        return node;
    }

    _getMathOpWeight(op: string): number {
        switch (op) {
            case '^':
                return 2;
            case '*':
            case '/':
            case '%':
                return 1;
            default: //+ and -
                return 0;
        }
    }
}