import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export class ClassNode implements Node {
    private _className: string;
    private _inherits?: string;
    private _children: Node[];

    constructor(className: string, children: Node[], inherits?: string) {
        this._className = className;
        this._children = children;
        this._inherits = inherits;
    }

    get className(): string {
        return this._className;
    }

    get inherits(): string | undefined {
        return this._inherits;
    }

    get children(): Node[] {
        return this._children;
    }

    get type(): string {
        return nodeTypes.class;
    }
}