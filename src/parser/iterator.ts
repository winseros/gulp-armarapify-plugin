export interface Iterator<T> {
    moveNext(): boolean;

    depleted: boolean;

    current: T;

    line: number;

    column: number;

    createCheckpoint(): Checkpoint<T>;
}

export interface Checkpoint<T> extends Iterator<T> {
    restore(): void;
}