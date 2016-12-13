import { Token } from './token';
import { Iterator } from '../iterator';

export abstract class TokenReader {
    abstract canRead(iterator: Iterator<string>): boolean;
    abstract read(iterator: Iterator<string>): Token;
}