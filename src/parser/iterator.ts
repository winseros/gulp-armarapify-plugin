export interface Iterator<T> {
    moveNext(): boolean;

    current: T;

    line: number;

    column: number;
}