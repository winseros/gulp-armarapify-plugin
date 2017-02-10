import { nodeTypes } from '../parser/nodes/nodeTypes';
import { Node } from '../parser/nodes/node';
import { ClassNode } from '../parser/nodes/classNode';
import { StringNode } from '../parser/nodes/stringNode';
import { ExpressionResolver } from './expressionResolver';
import { ExpressionParser } from '../parser/expressionParser';
import { PropertyNode } from '../parser/nodes/propertyNode';
import { ArrayNode } from '../parser/nodes/arrayNode';
import { TreeError } from '../serializer/treeError';
import { ParserError } from '../parser/parserError';
import { NodeError } from '../parser/nodeError';

export class TreeOptimizer {
    private _resolver = new ExpressionResolver();
    private _parser = new ExpressionParser();

    optimize(node: ClassNode): void {
        const pool = [node];
        while (pool.length) {
            const cls = pool.shift() !;
            for (let i = 0; i < cls.children.length; i++) {
                let child = cls.children[i];
                switch (child.type) {
                    case nodeTypes.class: {
                        pool.push(child as ClassNode);
                        break;
                    }
                    case nodeTypes.property: {
                        child = this._optimizeProperty(child as PropertyNode);
                        cls.children[i] = child;
                        break;
                    }
                    default: {
                        throw new TreeError(`Unexpected class child of type "${child.type}"`, child);
                    }
                }
            }
        }
    }

    _optimizeProperty(node: PropertyNode): PropertyNode {
        let result = node;
        if (node.value.type === nodeTypes.array) {
            this._optimizeArray(node.value as ArrayNode);
        } else {
            const optimized = this._optimizeScalar(node.value);
            result = optimized === node.value ? node : new PropertyNode(node.name, optimized);
        }
        return result;
    }

    _optimizeScalar(node: Node): Node {
        if (node.type === nodeTypes.string) {
            try {
                const data = (node as StringNode).value;
                node = this._parser.parseExpression(Buffer.from(data));
            }
            catch (ex) {
                if (!(ex instanceof ParserError || ex instanceof NodeError)) {
                    throw ex;//propagate only generic errors
                }
            }
        }
        const resolved = this._resolver.resolve(node);
        return resolved;
    }

    _optimizeArray(node: ArrayNode): void {
        for (let i = 0; i < node.value.length; i++) {
            let child = node.value[i];
            if (child.type === nodeTypes.array) {
                this._optimizeArray(child as ArrayNode);
            } else {
                child = this._optimizeScalar(child);
                node.value[i] = child;
            }
        }
    }
}