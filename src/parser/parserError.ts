import '../error';

export class ParserError extends Error {
    constructor(message: string, line: number, column: number) {
        super(message);
        Error.captureStackTrace(this, ParserError);

        this.line = line;
        this.comumn = column;
        this.name = 'ParserError';
    }

    line: number;

    comumn: number;
}