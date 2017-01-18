import { Token } from './token';
import { Iterator } from '../iterator';

export interface TokenReader<T> {
    canRead(iterator: Iterator<string>): boolean;
    read(iterator: Iterator<string>): Token<T>;
}