import { PreprocessorNode } from '../preprocessorNode';
import { nodeTypes } from '../nodeTypes';

describe('parser/nodes/constNode', () => {
    describe('ctor', () => {
        it('should initialize the object fields', () => {
            const node = new PreprocessorNode('instr-name');

            expect(node.commandName).toEqual('instr-name');
            expect(node.args).toEqual([]);
            expect(node.type).toEqual(nodeTypes.preprocessor);
        });
    });
});
