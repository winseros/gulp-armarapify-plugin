import { Token } from './token';
import { Iterator } from '../iterator';

export abstract class ReaderBase<T> {
    abstract _canRead(iterator: Iterator<string>): boolean;
    abstract _read(iterator: Iterator<string>): Token<T>;

    read(iterator: Iterator<string>): Token<T> | undefined {
        let result;
        const canRead = this._canRead(iterator);
        if (canRead) {
            result = this._read(iterator);
        }
        return result;
    }
}