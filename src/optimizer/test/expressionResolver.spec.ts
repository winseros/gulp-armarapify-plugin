import { ExpressionResolver } from '../expressionResolver';
import { mathOperators } from '../../mathOperators';
import { nodeTypes } from '../../parser/nodes/nodeTypes';
import { ArrayNode } from '../../parser/nodes/arrayNode';
import { IntegerNode } from '../../parser/nodes/integerNode';
import { FloatNode } from '../../parser/nodes/floatNode';
import { StringNode } from '../../parser/nodes/stringNode';
import { WordNode } from '../../parser/nodes/wordNode';
import { MathOpNode } from '../../parser/nodes/mathOpNode';
import { MathGrpNode } from '../../parser/nodes/mathGrpNode';
import { MathNegNode } from '../../parser/nodes/mathNegNode';

describe('optmizer/expressionResolver', () => {
    describe('resolve', () => {
        it('should throw in case of non-resolvable nodes', () => {
            const resolver = new ExpressionResolver();

            const node = new ArrayNode([]);

            expect(() => resolver.resolve(node)).toThrowError(`The node of type "${node.type}" was not expected`);
        });

        it('should resolve IntegerNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new IntegerNode(1);

            const resolved = resolver.resolve(node);
            expect(resolved).toBe(node);
        });

        it('should resolve FloatNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new FloatNode(1);

            const resolved = resolver.resolve(node);
            expect(resolved).toBe(node);
        });

        it('should resolve StringNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new StringNode('abc');

            const resolved = resolver.resolve(node);
            expect(resolved).toBe(node);
        });

        it('should resolve WordNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new WordNode('abc');

            const resolved = resolver.resolve(node);
            expect(resolved).toBe(node);
        });

        it('should resolve MathGrpNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new IntegerNode(1);

            const resolved = resolver.resolve(new MathGrpNode(node));
            expect(resolved).toBe(node);
        });

        it('should throw if can not perform an operation', () => {
            const resolver = new ExpressionResolver();

            const left = new IntegerNode(1);
            const right = new IntegerNode(2);
            const op = new MathOpNode('unknown-symbol', left, right);

            expect(() => resolver.resolve(op)).toThrowError('"unknown-symbol" is not a known math operation');
        });

        describe('plus', () => {
            it('should resolve plus operations with int values', () => {
                const op = new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as IntegerNode;

                expect(resolved.type).toEqual(nodeTypes.integer);
                expect(resolved.value).toEqual(3);
            });

            it('should resolve plus operations with float values', () => {
                const op = new MathOpNode(mathOperators.plus, new FloatNode(1.5), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(3.5);
            });
        });

        describe('minus', () => {
            it('should resolve minus operations with int values', () => {
                const op = new MathOpNode(mathOperators.minus, new IntegerNode(10), new IntegerNode(4));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as IntegerNode;

                expect(resolved.type).toEqual(nodeTypes.integer);
                expect(resolved.value).toEqual(6);
            });

            it('should resolve minus operations with float values', () => {
                const op = new MathOpNode(mathOperators.minus, new FloatNode(10.5), new IntegerNode(3));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(7.5);
            });
        });

        describe('multiplication', () => {
            it('should resolve multiplication operations with int values', () => {
                const op = new MathOpNode(mathOperators.mul, new IntegerNode(5), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as IntegerNode;

                expect(resolved.type).toEqual(nodeTypes.integer);
                expect(resolved.value).toEqual(10);
            });

            it('should resolve multiplication operations with float values', () => {
                const op = new MathOpNode(mathOperators.mul, new FloatNode(2.5), new IntegerNode(5));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(12.5);
            });
        });

        describe('division', () => {
            it('should resolve division operations with int values', () => {
                const op = new MathOpNode(mathOperators.div, new IntegerNode(10), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(5);
            });

            it('should resolve division operations with float values', () => {
                const op = new MathOpNode(mathOperators.div, new FloatNode(10.5), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(5.25);
            });
        });

        describe('power', () => {
            it('should resolve power operations with int values', () => {
                const op = new MathOpNode(mathOperators.pow, new IntegerNode(10), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as IntegerNode;

                expect(resolved.type).toEqual(nodeTypes.integer);
                expect(resolved.value).toEqual(100);
            });

            it('should resolve power operations with float values', () => {
                const op = new MathOpNode(mathOperators.pow, new FloatNode(2.5), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(6.25);
            });
        });

        describe('modulus', () => {
            it('should resolve modulus operations with int values', () => {
                const op = new MathOpNode(mathOperators.mod, new IntegerNode(10), new IntegerNode(3));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as IntegerNode;

                expect(resolved.type).toEqual(nodeTypes.integer);
                expect(resolved.value).toEqual(1);
            });

            it('should resolve modulus operations with float values', () => {
                const op = new MathOpNode(mathOperators.mod, new FloatNode(2.5), new IntegerNode(2));
                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(op) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(0.5);
            });
        });

        it('should resolve complex expressions with numbers', () => {
            const op1 = new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2));
            const op2 = new MathOpNode(mathOperators.mul, new IntegerNode(5), new MathGrpNode(op1));

            const resolver = new ExpressionResolver();
            const resolved = resolver.resolve(op2) as IntegerNode;

            expect(resolved.type).toEqual(nodeTypes.integer);
            expect(resolved.value).toEqual(15);
        });

        it('should partially resolve complex expressions with strings', () => {
            const op1 = new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2));
            const op2 = new MathOpNode(mathOperators.mul, new StringNode('a'), new MathGrpNode(op1));
            const grp2 = new MathGrpNode(op2);

            const resolver = new ExpressionResolver();
            const resolved = resolver.resolve(grp2) as MathGrpNode;

            expect(resolved.type).toEqual(nodeTypes.mathGrp);

            const mul = resolved.value as MathOpNode;
            expect(mul.type).toEqual(nodeTypes.mathOp);
            expect(mul.operator).toEqual(mathOperators.mul);

            expect(mul.left).toBe(op2.left);

            const mulRight = mul.right as IntegerNode;
            expect(mulRight.type).toEqual(nodeTypes.integer);
            expect(mulRight.value).toEqual(3);
        });

        it('should not resolve expressions with of strings', () => {
            const op1 = new MathOpNode(mathOperators.plus, new StringNode('a'), new IntegerNode(2));
            const grp1 = new MathGrpNode(op1);

            const resolver = new ExpressionResolver();
            const resolved = resolver.resolve(grp1);

            expect(resolved).toBe(grp1);
        });

        describe('negations', () => {
            it('should negate integer nodes', () => {
                const num = new IntegerNode(1);
                const neg = new MathNegNode(num);

                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(neg) as IntegerNode;

                expect(resolved.type).toEqual(nodeTypes.integer);
                expect(resolved.value).toEqual(-1);
            });

            it('should negate float nodes', () => {
                const num = new FloatNode(1.0);
                const neg = new MathNegNode(num);

                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(neg) as FloatNode;

                expect(resolved.type).toEqual(nodeTypes.float);
                expect(resolved.value).toEqual(-1.0);
            });

            it('should do nothing if negate node contents is resolved to itself', () => {
                const str = new StringNode('abc');
                const neg = new MathNegNode(str);

                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(neg);

                expect(resolved).toBe(neg);
            });

            it('should return negate node if node contents could not be fully resolved', () => {
                const op1 = new MathOpNode(mathOperators.plus, new IntegerNode(1), new IntegerNode(2));
                const op2 = new MathOpNode(mathOperators.mul, op1, new StringNode('var'));
                const neg = new MathNegNode(op2);

                const resolver = new ExpressionResolver();
                const resolved = resolver.resolve(neg) as MathNegNode;

                expect(resolved.type).toEqual(nodeTypes.mathNeg);
                expect(resolved).not.toBe(neg);
            });
        });
    });
});
