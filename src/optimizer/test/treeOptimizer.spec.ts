import { TreeOptimizer } from '../treeOptimizer';
import { ClassNode } from '../../parser/nodes/classNode';
import { StringNode } from '../../parser/nodes/stringNode';
import { IntegerNode } from '../../parser/nodes/integerNode';
import { PropertyNode } from '../../parser/nodes/propertyNode';
import { ArrayNode } from '../../parser/nodes/arrayNode';
import { ExpressionParser } from '../../parser/expressionParser';
import { ExpressionResolver } from '../expressionResolver';
import { nodeTypes } from '../../parser/nodes/nodeTypes';
import { NodeError } from '../../parser/nodeError';
import { ParserError } from '../../parser/parserError';

describe('optimizer/treeOptimizer', () => {
    describe('optimize', () => {
        it('should optimize class properties', () => {
            const child5 = new PropertyNode('c5', new StringNode('v5'));
            const classChild3 = new ClassNode('classChild3', [child5]);

            const child3 = new PropertyNode('c3', new StringNode('v3'));
            const child4 = new PropertyNode('c4', new StringNode('v4'));
            const classChild2 = new ClassNode('classChild2', [child3, child4, classChild3]);

            const child2 = new PropertyNode('c2', new StringNode('v2'));
            const classChild1 = new ClassNode('classChild1', [child2]);

            const child1 = new PropertyNode('c1', new StringNode('v1'));
            const node = new ClassNode('', [child1, classChild1, classChild2]);

            spyOn(TreeOptimizer.prototype, '_optimizeProperty').and.callFake((p: PropertyNode) => p);

            const optimizer = new TreeOptimizer();
            optimizer.optimize(node);

            expect(TreeOptimizer.prototype._optimizeProperty).toHaveBeenCalledTimes(5);
            expect(TreeOptimizer.prototype._optimizeProperty).toHaveBeenCalledWith(child1);
            expect(TreeOptimizer.prototype._optimizeProperty).toHaveBeenCalledWith(child2);
            expect(TreeOptimizer.prototype._optimizeProperty).toHaveBeenCalledWith(child3);
            expect(TreeOptimizer.prototype._optimizeProperty).toHaveBeenCalledWith(child4);
            expect(TreeOptimizer.prototype._optimizeProperty).toHaveBeenCalledWith(child5);
        });

        it('should replace optimized children', () => {
            const child1 = new PropertyNode('c1', new StringNode('v1'));
            const node = new ClassNode('', [child1]);

            const fakeNode = { prop: 'fake' };
            spyOn(TreeOptimizer.prototype, '_optimizeProperty').and.returnValue(fakeNode);

            const optimizer = new TreeOptimizer();
            optimizer.optimize(node);

            expect(node.children.length).toEqual(1);
            expect(node.children[0]).toBe(fakeNode);
        });

        it('should throw in case of unexpected class child', () => {
            const child1 = new StringNode('v1');
            const node = new ClassNode('', [child1]);

            const optimizer = new TreeOptimizer();
            expect(() => optimizer.optimize(node)).toThrowError(`Unexpected class child of type "${child1.type}"`);
        });
    });

    describe('_optimizeProperty', () => {
        it('should optimize array properties', () => {
            const arr = new ArrayNode([]);
            const prop = new PropertyNode('p1', arr);

            spyOn(TreeOptimizer.prototype, '_optimizeArray');

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeProperty(prop);

            expect(optimized).toBe(prop);

            expect(TreeOptimizer.prototype._optimizeArray).toHaveBeenCalledTimes(1);
            expect(TreeOptimizer.prototype._optimizeArray).toHaveBeenCalledWith(arr);
        });

        it('should optimize scalar properties and return input value if property didn`t change', () => {
            const int = new IntegerNode(1);
            const prop = new PropertyNode('p1', int);

            spyOn(TreeOptimizer.prototype, '_optimizeScalar').and.returnValue(int);

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeProperty(prop);

            expect(optimized).toBe(prop);

            expect(TreeOptimizer.prototype._optimizeScalar).toHaveBeenCalledTimes(1);
            expect(TreeOptimizer.prototype._optimizeScalar).toHaveBeenCalledWith(int);
        });

        it('should optimize scalar properties and return a new value if property changed', () => {
            const value = new IntegerNode(1);
            const prop = new PropertyNode('p1', value);

            const optimizedValue = new IntegerNode(2);

            spyOn(TreeOptimizer.prototype, '_optimizeScalar').and.returnValue(optimizedValue);

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeProperty(prop);

            expect(optimized).not.toBe(prop);
            expect(optimized.type).toEqual(nodeTypes.property);
            expect(optimized.name).toEqual(prop.name);
            expect(optimized.value).toBe(optimizedValue);
        });
    });

    describe('_optimizeScalar', () => {
        it('should resolve non-string properties', () => {
            const initialValue = new IntegerNode(1);
            const resolvedValue = new IntegerNode(2);

            spyOn(ExpressionParser.prototype, 'parseExpression');
            spyOn(ExpressionResolver.prototype, 'resolve').and.returnValue(resolvedValue);

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeScalar(initialValue);

            expect(optimized).toBe(resolvedValue);

            expect(ExpressionParser.prototype.parseExpression).not.toHaveBeenCalled();
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledTimes(1);
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledWith(initialValue);
        });

        it('should resolve non-string properties', () => {
            const initialValue = new IntegerNode(1);
            const resolvedValue = new IntegerNode(2);

            spyOn(ExpressionParser.prototype, 'parseExpression');
            spyOn(ExpressionResolver.prototype, 'resolve').and.returnValue(resolvedValue);

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeScalar(initialValue);

            expect(optimized).toBe(resolvedValue);

            expect(ExpressionParser.prototype.parseExpression).not.toHaveBeenCalled();
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledTimes(1);
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledWith(initialValue);
        });

        it('should parse string nodes and resolve parsed value', () => {
            const strValue = new StringNode('str1');

            const parsedValue = new IntegerNode(1);
            const resolvedValue = new IntegerNode(2);

            spyOn(ExpressionParser.prototype, 'parseExpression').and.returnValue(parsedValue);
            spyOn(ExpressionResolver.prototype, 'resolve').and.returnValue(resolvedValue);

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeScalar(strValue);

            expect(optimized).toBe(resolvedValue);

            expect(ExpressionParser.prototype.parseExpression).toHaveBeenCalledTimes(1);
            expect(ExpressionParser.prototype.parseExpression).toHaveBeenCalledWith(Buffer.from(strValue.value));
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledTimes(1);
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledWith(parsedValue);
        });

        it('should try to parse string nodes and catch ParserErrors', () => {
            const value = new StringNode('str1');

            spyOn(ExpressionParser.prototype, 'parseExpression').and.callFake(() => { throw new ParserError('msg', 0, 0, 0); });
            spyOn(ExpressionResolver.prototype, 'resolve').and.callThrough();

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeScalar(value);

            expect(optimized).toBe(value);

            expect(ExpressionParser.prototype.parseExpression).toHaveBeenCalledTimes(1);
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledTimes(1);
        });

        it('should try to parse string nodes and catch NodeErrors', () => {
            const value = new StringNode('str1');

            spyOn(ExpressionParser.prototype, 'parseExpression').and.callFake(() => { throw new NodeError('msg', 0, 0, 0); });
            spyOn(ExpressionResolver.prototype, 'resolve').and.callThrough();

            const optimizer = new TreeOptimizer();
            const optimized = optimizer._optimizeScalar(value);

            expect(optimized).toBe(value);

            expect(ExpressionParser.prototype.parseExpression).toHaveBeenCalledTimes(1);
            expect(ExpressionResolver.prototype.resolve).toHaveBeenCalledTimes(1);
        });

        it('should try to parse string nodes and rethrow generic errors', () => {
            const prop = new StringNode('str1');

            spyOn(ExpressionParser.prototype, 'parseExpression').and.throwError('some error');

            const optimizer = new TreeOptimizer();
            expect(() => optimizer._optimizeScalar(prop)).toThrowError('some error');
        });
    });

    describe('_optimizeArray', () => {
        it('should pass through the array elements', () => {
            const e1 = new StringNode('str1');
            const e21 = new IntegerNode(1);
            const e2 = new ArrayNode([e21]);
            const e31 = new IntegerNode(2);
            const e3 = new ArrayNode([e31]);

            const arr = new ArrayNode([e1, e2, e3]);

            const e1optimized = new IntegerNode(3);

            spyOn(TreeOptimizer.prototype, '_optimizeArray').and.callThrough();
            spyOn(TreeOptimizer.prototype, '_optimizeScalar').and.returnValue(e1optimized);

            const optimizer = new TreeOptimizer();
            optimizer._optimizeArray(arr);

            expect(arr.value[0]).toBe(e1optimized);

            expect(TreeOptimizer.prototype._optimizeArray).toHaveBeenCalledTimes(3);
            expect(TreeOptimizer.prototype._optimizeArray).toHaveBeenCalledWith(e2);
            expect(TreeOptimizer.prototype._optimizeArray).toHaveBeenCalledWith(e3);

            expect(TreeOptimizer.prototype._optimizeScalar).toHaveBeenCalledTimes(3);
            expect(TreeOptimizer.prototype._optimizeScalar).toHaveBeenCalledWith(e1);
            expect(TreeOptimizer.prototype._optimizeScalar).toHaveBeenCalledWith(e21);
            expect(TreeOptimizer.prototype._optimizeScalar).toHaveBeenCalledWith(e31);
        });
    });
});