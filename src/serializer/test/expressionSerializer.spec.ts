import { ExpressionSerializer } from '../expressionSerializer';
import { nodeTypes } from '../../parser/nodes/nodeTypes';
import { ClassNode } from '../../parser/nodes/classNode';
import { WordNode } from '../../parser/nodes/wordNode';
import { StringNode } from '../../parser/nodes/stringNode';
import { IntegerNode } from '../../parser/nodes/integerNode';
import { FloatNode } from '../../parser/nodes/floatNode';
import { MathGrpNode } from '../../parser/nodes/mathGrpNode';
import { MathOpNode } from '../../parser/nodes/mathOpNode';
import { MathNegNode } from '../../parser/nodes/mathNegNode';
import { mathOperators } from '../../mathOperators';

describe('serializer/expressionSerializer', () => {
    describe('serialize', () => {
        it('should do nothing if input node is not a mathOp/mathGrp/mathNeg', () => {
            const node = new StringNode('str-value');
            const serializer = new ExpressionSerializer();
            const serialized = serializer.serialize(node);

            expect(serialized).toBe(node);
        });

        it('should stringify mathOp nodes', () => {
            const op = new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2));

            spyOn(ExpressionSerializer.prototype, '_serializeExpr').and.returnValue('serialized-value');

            const serializer = new ExpressionSerializer();
            const serialized = serializer.serialize(op) as StringNode;

            expect(serialized.type).toEqual(nodeTypes.string);
            expect(serialized.value).toEqual('serialized-value');

            expect(ExpressionSerializer.prototype._serializeExpr).toHaveBeenCalledTimes(1);
            expect(ExpressionSerializer.prototype._serializeExpr).toHaveBeenCalledWith(op);
        });

        it('should stringify mathGrp nodes', () => {
            const grp = new MathGrpNode(new IntegerNode(1));

            spyOn(ExpressionSerializer.prototype, '_serializeExpr').and.returnValue('serialized-value');

            const serializer = new ExpressionSerializer();
            const serialized = serializer.serialize(grp) as StringNode;

            expect(serialized.type).toEqual(nodeTypes.string);
            expect(serialized.value).toEqual('serialized-value');

            expect(ExpressionSerializer.prototype._serializeExpr).toHaveBeenCalledTimes(1);
            expect(ExpressionSerializer.prototype._serializeExpr).toHaveBeenCalledWith(grp);
        });

        it('should stringify mathNeg nodes', () => {
            const grp = new MathNegNode(new IntegerNode(1));

            spyOn(ExpressionSerializer.prototype, '_serializeExpr').and.returnValue('serialized-value');

            const serializer = new ExpressionSerializer();
            const serialized = serializer.serialize(grp) as StringNode;

            expect(serialized.type).toEqual(nodeTypes.string);
            expect(serialized.value).toEqual('serialized-value');

            expect(ExpressionSerializer.prototype._serializeExpr).toHaveBeenCalledTimes(1);
            expect(ExpressionSerializer.prototype._serializeExpr).toHaveBeenCalledWith(grp);
        });
    });

    describe('_serializeExpr', () => {
        it('should throw if node type was unexpected', () => {
            const op = new ClassNode('cls', []);
            const serializer = new ExpressionSerializer();
            expect(() => serializer._serializeExpr(op)).toThrowError(`The node of type "${op.type}" was not expected`);
        });

        it('should throw if math operation was unexpected', () => {
            const op = new MathOpNode('abc', new IntegerNode(1), new IntegerNode(2));
            const serializer = new ExpressionSerializer();
            expect(() => serializer._serializeExpr(op)).toThrowError('"abc" is not a known math operation');
        });

        it('should serialize plus operations', () => {
            const op = new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual('1+2');
        });

        it('should serialize minus operations', () => {
            const op = new MathOpNode(mathOperators.minus, new FloatNode(10.5), new IntegerNode(2));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual('10.5-2');
        });

        it('should serialize multiplication operations', () => {
            const op = new MathOpNode(mathOperators.mul, new IntegerNode(10), new StringNode('a'));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual('10*a');
        });

        it('should serialize division operations', () => {
            const op = new MathOpNode(mathOperators.div, new IntegerNode(10), new StringNode('a'));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual('10/a');
        });

        it('should serialize power operations', () => {
            const op = new MathOpNode(mathOperators.pow, new IntegerNode(10), new WordNode('a'));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual('10^a');
        });

        it('should serialize negation operations', () => {
            const op = new MathNegNode(new IntegerNode(10));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual(' -10');
        });

        it('should serialize modulus operations', () => {
            const op = new MathOpNode(mathOperators.mod, new IntegerNode(10), new IntegerNode(2));
            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op);

            expect(str).toEqual('10%2');
        });

        it('should serialize complex operations', () => {
            const op1 = new MathOpNode(mathOperators.plus, new IntegerNode(10), new IntegerNode(2));
            const op2 = new MathOpNode(mathOperators.mul, new MathGrpNode(op1), new StringNode('a'));

            const serializer = new ExpressionSerializer();
            const str = serializer._serializeExpr(op2);

            expect(str).toEqual('(10+2)*a');
        });
    });
});
