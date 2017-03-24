import '../error';

export class NodeError extends Error {
    constructor(message: string, line: number, column: number, index: number) {
        super(message);
        Error.captureStackTrace(this, NodeError);

        this.line = line;
        this.comumn = column;
        this.index = index;
        this.name = 'NodeError';
    }

    readonly line: number;

    readonly comumn: number;

    readonly index: number;
}