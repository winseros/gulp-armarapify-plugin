export interface Iterator<T> {
    moveNext(): boolean;

    depleted: boolean;

    current: T;

    line: number;

    column: number;
}