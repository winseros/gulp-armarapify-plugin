import { Iterator } from './iterator';
import { CharIterator } from './charIterator';
import { Token } from './tokens/token';

export class TokenIterator implements Iterator<Token> {
    private _iterator: CharIterator;
    private _current: Token;

    constructor(buffer: Buffer) {
        this._iterator = new CharIterator(buffer);
    }

    moveNext(): boolean {
        const hasNext = this._iterator.moveNext();
        if (hasNext) {
            this._current = this._readNextToken();
        }
        return hasNext;
    }

    get current(): Token {
        return this._current;
    }

    _readNextToken(): Token {
        throw new Error();
    }
}