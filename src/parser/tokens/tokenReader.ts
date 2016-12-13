import { Token } from './token';
import { Iterator } from '../iterator';

export abstract class TokenReader<T> {
    abstract canRead(iterator: Iterator<string>): boolean;
    abstract read(iterator: Iterator<string>): Token<T>;
}