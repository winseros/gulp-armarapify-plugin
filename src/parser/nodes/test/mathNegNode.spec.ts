import { Node } from '../../nodes/node';
import { MathNegNode } from '../mathNegNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/mathGrpNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const data = { type: 't1' } as Node;
            const node = new MathNegNode(data);
            expect(node.value).toBe(data);
            expect(node.type).toEqual(nodeTypes.mathNeg);
        });
    });
});
