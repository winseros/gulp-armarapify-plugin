export declare class Error implements Error {
    constructor(message?: string);

    stack?: string;

    name: string;

    message: string;
}

export class ParserError extends Error {
    constructor(message: string, line: number, column: number) {
        super(message);
        this.line = line;
        this.comumn = column;
        this.name = 'ParserError';
    }

    line: number;

    comumn: number;
}