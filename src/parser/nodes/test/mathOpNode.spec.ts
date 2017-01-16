import { Node } from '../../nodes/node';
import { MathOpNode } from '../mathOpNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/mathOpNode', () => {
    describe('ctor', () => {
        it('should initialize object properties with 2 args', () => {
            const left = { type: 't1' } as Node;
            const node = new MathOpNode('+', left);
            expect(node.operator).toEqual('+');
            expect(node.left).toBe(left);
            expect(node.right).not.toBeDefined();
            expect(node.type).toEqual(nodeTypes.mathOp);
        });

        it('should initialize object properties with 3 args', () => {
            const left = { type: 't1' } as Node;
            const right = { type: 't2' } as Node;
            const node = new MathOpNode('-', left, right);
            expect(node.operator).toEqual('-');
            expect(node.left).toBe(left);
            expect(node.right).toBe(right);
            expect(node.type).toEqual(nodeTypes.mathOp);
        });
    });
});
