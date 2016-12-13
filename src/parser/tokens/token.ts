export interface Token<T> {
    tokenType: string;
    tokenValue: T;
    lineNumber: number;
    colNumber: number;
}