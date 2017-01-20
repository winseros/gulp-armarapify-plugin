export declare class Error implements Error {
    constructor(message?: string);

    stack?: string;

    name: string;

    message: string;
}