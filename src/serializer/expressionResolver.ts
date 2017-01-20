import { nodeTypes } from '../parser/nodes/nodeTypes';
import { Node } from '../parser/nodes/node';
import { MathOpNode } from '../parser/nodes/mathOpNode';
import { MathGrpNode } from '../parser/nodes/mathGrpNode';
import { NumberNode } from '../parser/nodes/numberNode';
import { TreeError } from './treeError';
import { mathOperators } from '../mathOperators';

export class ExpressionResolver {
    resolve(expression: Node): NumberNode {
        let result: NumberNode;
        switch (expression.type) {
            case nodeTypes.mathGrp: {
                result = this.resolve((expression as MathGrpNode).value);
                break;
            }
            case nodeTypes.mathOp: {
                result = this._resolveOp(expression as MathOpNode);
                break;
            }
            case nodeTypes.number: {
                return expression as NumberNode;
            }
            default: {
                throw new TreeError(`The node of type "${expression.type}" was not expected`, expression);
            }
        }
        return result;
    }

    _resolveOp(node: MathOpNode): NumberNode {
        let result: NumberNode;
        switch (node.operator) {
            case mathOperators.plus: {
                result = this._performOperation(node, 'plus', (x, y) => x + y);
                break;
            }
            case mathOperators.minus: {
                result = this._performOperation(node, 'minus', (x, y) => x - y);
                break;
            }
            case mathOperators.mul: {
                result = this._performOperation(node, 'multiply', (x, y) => x * y);
                break;
            }
            case mathOperators.div: {
                result = this._performOperation(node, 'divide', (x, y) => x / y, true);
                break;
            }
            case mathOperators.pow: {
                result = this._performOperation(node, 'power', (x, y) => Math.pow(x, y));
                break;
            }
            case mathOperators.mod: {
                result = this._performOperation(node, 'plus', (x, y) => x % y);
                break;
            }
            default: {
                throw new TreeError(`"${node.operator}" is not a known math operation`, node);
            }
        }

        return result;
    }

    _performOperation(
        node: MathOpNode,
        operationDescription: string,
        impl: (left: number, right: number) => number,
        forceFloat = false
    ): NumberNode {
        const left = this.resolve(node.left);
        const right = this.resolve(node.right);

        const value = impl(left.value, right.value);

        const isFloat = forceFloat || this._isFloat(left, right);
        return new NumberNode(value, isFloat);
    }

    _isFloat(left: NumberNode, right: NumberNode): boolean {
        const result = left.isFloat || right.isFloat;
        return result;
    }
}