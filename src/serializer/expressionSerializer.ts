import { nodeTypes } from '../parser/nodes/nodeTypes';
import { Node } from '../parser/nodes/node';
import { MathOpNode } from '../parser/nodes/mathOpNode';
import { MathGrpNode } from '../parser/nodes/mathGrpNode';
import { MathNegNode } from '../parser/nodes/mathNegNode';
import { ConstNode } from '../parser/nodes/constNode';
import { StringNode } from '../parser/nodes/stringNode';
import { TreeError } from './treeError';
import { mathOperators } from '../mathOperators';

export class ExpressionSerializer {
    serialize(expression: Node): Node {
        if (expression.type === nodeTypes.mathOp || expression.type === nodeTypes.mathGrp || expression.type === nodeTypes.mathNeg) {
            const expressionBody = this._serializeExpr(expression);
            expression = new StringNode(expressionBody);
        }
        return expression;
    }

    _serializeExpr(expression: Node): string {
        let result: string;
        switch (expression.type) {
            case nodeTypes.mathGrp: {
                result = this._serializeGrp(expression as MathGrpNode);
                break;
            }
            case nodeTypes.mathOp: {
                result = this._serializeOp(expression as MathOpNode);
                break;
            }
            case nodeTypes.mathNeg: {
                result = this._serializeNeg(expression as MathNegNode);
                break;
            }
            case nodeTypes.integer:
            case nodeTypes.float:
            case nodeTypes.string:
            case nodeTypes.word: {
                result = (expression as ConstNode<string | number>).value.toString();
                break;
            }
            default: {
                throw new TreeError(`The node of type "${expression.type}" was not expected`, expression);
            }
        }
        return result;
    }

    _serializeGrp(node: MathGrpNode): string {
        const body = this._serializeExpr(node.value);
        const result = `(${body})`;
        return result;
    }

    _serializeOp(node: MathOpNode): string {
        let result: string;
        switch (node.operator) {
            case mathOperators.plus: {
                result = this._performOperation(node, (x, y) => `${x}+${y}`);
                break;
            }
            case mathOperators.minus: {
                result = this._performOperation(node, (x, y) => `${x}-${y}`);
                break;
            }
            case mathOperators.mul: {
                result = this._performOperation(node, (x, y) => `${x}*${y}`);
                break;
            }
            case mathOperators.div: {
                result = this._performOperation(node, (x, y) => `${x}/${y}`);
                break;
            }
            case mathOperators.pow: {
                result = this._performOperation(node, (x, y) => `${x}^${y}`);
                break;
            }
            case mathOperators.mod: {
                result = this._performOperation(node, (x, y) => `${x}%${y}`);
                break;
            }
            default: {
                throw new TreeError(`"${node.operator}" is not a known math operation`, node);
            }
        }

        return result;
    }

    _serializeNeg(node: MathNegNode): string {
        const body = this._serializeExpr(node.value);
        const result = ` -${body}`;
        return result;
    }

    _performOperation(
        node: MathOpNode,
        impl: (left: string, right: string) => string
    ): string {
        const left = this._serializeExpr(node.left);
        const right = this._serializeExpr(node.right);

        const result = impl(left, right);
        return result;
    }
}