import { Token } from './token';
import { Iterator } from '../iterator';

export interface TokenReader<T> {
    read(iterator: Iterator<string>): Token<T> | undefined;
}