import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export class DeleteNode implements Node {
    private _className: string;

    constructor(className: string) {
        this._className = className;
    }

    get className(): string {
        return this._className;
    }

    get type(): string {
        return nodeTypes.delete;
    }
}