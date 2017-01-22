import '../error';
import { Node } from '../parser/nodes/node';

export class TreeError extends Error {
    constructor(message: string, node: Node) {
        super(message);
        Error.captureStackTrace(this, TreeError);

        this.name = 'TreeError';
        this.node = node;
    }

    readonly node: Node;
}