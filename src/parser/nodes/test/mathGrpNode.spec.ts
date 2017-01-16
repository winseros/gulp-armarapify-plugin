import { Node } from '../../nodes/node';
import { MathGrpNode } from '../mathGrpNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/mathGrpNode', () => {
    describe('ctor', () => {
        it('should initialize object properties', () => {
            const data = { type: 't1' } as Node;
            const node = new MathGrpNode(data);
            expect(node.value).toBe(data);
            expect(node.type).toEqual(nodeTypes.mathGrp);
        });
    });
});
