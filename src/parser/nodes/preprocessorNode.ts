import { Node } from './node';
import { nodeTypes } from './nodeTypes';

export class PreprocessorNode implements Node {
    private _commandName: string;
    private _args: Node[] = [];

    constructor(commandName: string) {
        this._commandName = commandName;
    }

    get commandName(): string {
        return this._commandName;
    }

    get args(): Node[] {
        return this._args;
    }

    get type(): string {
        return nodeTypes.preprocessor;
    }
}