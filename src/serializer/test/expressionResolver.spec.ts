import { ExpressionResolver } from '../expressionResolver';
import { mathOperators } from '../../mathOperators';
import { nodeTypes } from '../../parser/nodes/nodeTypes';
import { ArrayNode } from '../../parser/nodes/arrayNode';
import { NumberNode } from '../../parser/nodes/numberNode';
import { MathOpNode } from '../../parser/nodes/mathOpNode';
import { MathGrpNode } from '../../parser/nodes/mathGrpNode';

describe('serializer/expressionResolver', () => {
    describe('resolve', () => {
        it('should throw in case of non-resolvable nodes', () => {
            const resolver = new ExpressionResolver();

            const node = new ArrayNode([]);

            expect(() => resolver.resolve(node)).toThrowError(`The node of type "${node.type}" was not expected`);
        });

        it('should resolve NumberNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new NumberNode(1, false);

            const resolved = resolver.resolve(node);
            expect(resolved).toBe(node);
        });

        it('should resolve MathGrpNodes', () => {
            const resolver = new ExpressionResolver();

            const node = new NumberNode(1, false);

            const resolved = resolver.resolve(new MathGrpNode(node));
            expect(resolved).toBe(node);
        });

        it('should throw if can not perform an operation', () => {
            const resolver = new ExpressionResolver();

            const left = new NumberNode(1, false);
            const right = new NumberNode(2, false);
            const op = new MathOpNode('unknown-symbol', left, right);

            expect(() => resolver.resolve(op)).toThrowError('"unknown-symbol" is not a known math operation');
        });

        describe('plus', () => {
            it('should resolve plus operations with int values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(1, false);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.plus, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(3);
                expect(resolved.isFloat).toEqual(false);
            });

            it('should resolve plus operations with float values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(1.5, true);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.plus, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(3.5);
                expect(resolved.isFloat).toEqual(true);
            });
        });

        describe('minus', () => {
            it('should resolve minus operations with int values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(10, false);
                const right = new NumberNode(4, false);
                const op = new MathOpNode(mathOperators.minus, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(6);
                expect(resolved.isFloat).toEqual(false);
            });

            it('should resolve minus operations with float values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(10.5, true);
                const right = new NumberNode(3, false);
                const op = new MathOpNode(mathOperators.minus, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(7.5);
                expect(resolved.isFloat).toEqual(true);
            });
        });

        describe('multiplication', () => {
            it('should resolve multiplication operations with int values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(5, false);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.mul, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(10);
                expect(resolved.isFloat).toEqual(false);
            });

            it('should resolve multiplication operations with float values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(2.5, true);
                const right = new NumberNode(5, false);
                const op = new MathOpNode(mathOperators.mul, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(12.5);
                expect(resolved.isFloat).toEqual(true);
            });
        });

        describe('division', () => {
            it('should resolve division operations with int values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(10, false);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.div, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(5);
                expect(resolved.isFloat).toEqual(true);
            });

            it('should resolve division operations with float values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(10.5, true);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.div, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(5.25);
                expect(resolved.isFloat).toEqual(true);
            });
        });

        describe('power', () => {
            it('should resolve power operations with int values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(10, false);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.pow, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(100);
                expect(resolved.isFloat).toEqual(false);
            });

            it('should resolve power operations with float values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(2.5, true);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.pow, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(6.25);
                expect(resolved.isFloat).toEqual(true);
            });
        });

        describe('modulus', () => {
            it('should resolve modulus operations with int values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(10, false);
                const right = new NumberNode(3, false);
                const op = new MathOpNode(mathOperators.mod, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(1);
                expect(resolved.isFloat).toEqual(false);
            });

            it('should resolve modulus operations with float values', () => {
                const resolver = new ExpressionResolver();

                const left = new NumberNode(2.5, true);
                const right = new NumberNode(2, false);
                const op = new MathOpNode(mathOperators.mod, left, right);

                const resolved = resolver.resolve(op);

                expect(resolved.type).toEqual(nodeTypes.number);
                expect(resolved.value).toEqual(0.5);
                expect(resolved.isFloat).toEqual(true);
            });
        });

        it('should resolve complex expressions', () => {
            const resolver = new ExpressionResolver();

            const left1 = new NumberNode(1, false);
            const right1 = new NumberNode(2, false);
            const op1 = new MathOpNode(mathOperators.plus, left1, right1);

            const left2 = new NumberNode(10, false);
            const op2 = new MathOpNode(mathOperators.minus, left2, op1);

            const resolved = resolver.resolve(op2);

            expect(resolved.type).toEqual(nodeTypes.number);
            expect(resolved.value).toEqual(7);
            expect(resolved.isFloat).toEqual(false);
        });
    });

});
