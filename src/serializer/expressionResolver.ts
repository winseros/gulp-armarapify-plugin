import { nodeTypes } from '../parser/nodes/nodeTypes';
import { Node } from '../parser/nodes/node';
import { MathOpNode } from '../parser/nodes/mathOpNode';
import { MathGrpNode } from '../parser/nodes/mathGrpNode';
import { MathNegNode } from '../parser/nodes/mathNegNode';
import { IntegerNode } from '../parser/nodes/integerNode';
import { FloatNode } from '../parser/nodes/floatNode';
import { StringNode } from '../parser/nodes/stringNode';
import { WordNode } from '../parser/nodes/wordNode';
import { ConstNode } from '../parser/nodes/constNode';
import { TreeError } from './treeError';
import { mathOperators } from '../mathOperators';

const numberTypes = [nodeTypes.integer, nodeTypes.float];

export class ExpressionResolver {
    resolve(expression: Node): Node {
        let result: Node;
        switch (expression.type) {
            case nodeTypes.mathGrp: {
                result = this._resolveGrp(expression as MathGrpNode);
                break;
            }
            case nodeTypes.mathOp: {
                result = this._resolveOp(expression as MathOpNode);
                break;
            }
            case nodeTypes.mathNeg: {
                result = this._resolveNeg(expression as MathNegNode);
                break;
            }
            case nodeTypes.integer: {
                return expression as IntegerNode;
            }
            case nodeTypes.float: {
                return expression as FloatNode;
            }
            case nodeTypes.string: {
                return expression as StringNode;
            }
            case nodeTypes.word: {
                return expression as WordNode;
            }
            default: {
                throw new TreeError(`The node of type "${expression.type}" was not expected`, expression);
            }
        }
        return result;
    }

    _resolveGrp(node: MathGrpNode): Node {
        let result = this.resolve(node.value);
        if (result.type === nodeTypes.mathOp) {
            if (result === node.value) {
                result = node;
            } else {
                result = new MathGrpNode(result);
            }
        }
        return result;
    }

    _resolveOp(node: MathOpNode): Node {
        let result: Node;
        switch (node.operator) {
            case mathOperators.plus: {
                result = this._performOperation(node, (x, y) => x + y);
                break;
            }
            case mathOperators.minus: {
                result = this._performOperation(node, (x, y) => x - y);
                break;
            }
            case mathOperators.mul: {
                result = this._performOperation(node, (x, y) => x * y);
                break;
            }
            case mathOperators.div: {
                result = this._performOperation(node, (x, y) => x / y, true);
                break;
            }
            case mathOperators.pow: {
                result = this._performOperation(node, (x, y) => Math.pow(x, y));
                break;
            }
            case mathOperators.mod: {
                result = this._performOperation(node, (x, y) => x % y);
                break;
            }
            default: {
                throw new TreeError(`"${node.operator}" is not a known math operation`, node);
            }
        }

        return result;
    }

    _resolveNeg(node: MathNegNode): Node {
        let result = this.resolve(node.value);
        if (result.type === nodeTypes.integer) {
            const int = result as IntegerNode;
            result = new IntegerNode(-int.value);
        } else if (result.type === nodeTypes.float) {
            const flt = result as FloatNode;
            result = new FloatNode(-flt.value);
        } else if (result === node.value) {
            result = node;
        } else {
            result = new MathNegNode(result);
        }

        return result;
    }

    _performOperation(
        node: MathOpNode,
        impl: (left: number, right: number) => number,
        forceFloat = false
    ): Node {
        const left = this.resolve(node.left);
        const right = this.resolve(node.right);

        let result: Node = node;
        const resolvable = numberTypes.indexOf(left.type) >= 0 && numberTypes.indexOf(right.type) >= 0;
        if (resolvable) {
            const float = forceFloat || left.type === nodeTypes.float || right.type === nodeTypes.float;
            const valueNum = impl((left as ConstNode<number>).value, (right as ConstNode<number>).value);
            result = float ? new FloatNode(valueNum) : new IntegerNode(valueNum);
        } else if (left !== node.left || right !== node.right) {
            result = new MathOpNode(node.operator, left, right);
        }
        return result;
    }
}