import '../error';

export class NodeError extends Error {
    constructor(message: string, line: number, column: number) {
        super(message);
        Error.captureStackTrace(this, NodeError);

        this.line = line;
        this.comumn = column;
        this.name = 'NodeError';
    }

    line: number;

    comumn: number;
}