import '../error';

export class ParserError extends Error {
    constructor(message: string, line: number, column: number, index: number) {
        super(message);
        Error.captureStackTrace(this, ParserError);

        this.line = line;
        this.comumn = column;
        this.index = index;
        this.name = 'ParserError';
    }

    readonly line: number;

    readonly comumn: number;

    readonly index: number;
}