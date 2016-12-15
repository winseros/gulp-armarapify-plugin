import { ClassNode } from './classNode';
import { Node } from './node';
import { NodeError } from './../nodeError';
import { TokenIterator } from './../tokenIterator';
import { Token } from './../tokens/token';
import { tokenTypes } from './../tokens/tokenTypes';

export class ClassReader {
    private _iterator: TokenIterator;

    constructor(buffer: Buffer) {
        this._iterator = new TokenIterator(buffer);
    }

    readClassNodes(): Node[] {
        const result = [] as Node[];

        while (this._iterator.moveNext()) {
            const tokenType = this._iterator.current.tokenType;

            if (this._isNonSenseToken(tokenType)) {
                continue;
            } else if (tokenType === tokenTypes.codeBlockEnd) {
                break;
            }

            const child = this._readNextNode(this._iterator);
            result.push(child);
        }

        return result;
    }

    _readNextNode(iterator: TokenIterator): Node {
        const current = iterator.current;
        const type = current.tokenType;
        const value = current.tokenValue;

        if (type === tokenTypes.word) {
            const node = this._readNextWord(iterator, current);
            return node;
        } else {
            const msg = `Token "${value}" is not expected`;
            throw new NodeError(msg, current.lineNumber, current.colNumber);
        }
    }

    _isNonSenseToken(tokenType: string) {
        const result = tokenType === tokenTypes.comment || tokenType === tokenTypes.cr || tokenType === tokenTypes.lf;
        return result;
    }

    _readNextWord(iterator: TokenIterator, token: Token<any>): Node {
        const current = iterator.current as Token<string>;
        const result = current.tokenValue.toLowerCase() === 'class'
            ? this._readNextClass(iterator)
            : this._readNextProperty(current.tokenValue, iterator);
        return result;
    }

    _readNextClass(iterator: TokenIterator): Node {
        const classNameToken = this._expectNextToken(iterator, 'Class name', tokenTypes.word);

        const nextToken = this._expectNextToken(iterator, '{ or :', tokenTypes.codeBlockStart, tokenTypes.colon);

        let inheritsToken: Token<string> | undefined;
        if (nextToken.tokenType === tokenTypes.colon) {
            inheritsToken = this._expectNextToken(iterator, 'Base class name', tokenTypes.word) as Token<string>;
            this._expectNextToken(iterator, '{', tokenTypes.codeBlockStart);
        }

        const children = this.readClassNodes();

        this._expectNextToken(iterator, ';', tokenTypes.semicolon);

        const className = classNameToken.tokenValue as string;
        const inherits = inheritsToken ? inheritsToken.tokenValue : undefined;
        return new ClassNode(className, children, inherits);
    }

    _readNextProperty(propertyName: string, iterator: TokenIterator): Node {
        throw new Error();
    }

    _expectNextToken(iterator: TokenIterator, tokenName: string, ...tokenTypes: string[]): Token<string | number> {
        let hasToken = false;

        while (iterator.moveNext()) {
            if (this._isNonSenseToken(iterator.current.tokenType)) {
                continue;
            }
            hasToken = true;
            break;
        }

        if (!hasToken) {
            throw new NodeError(`${tokenName} expected but got EOF`, iterator.line, iterator.column);
        }

        if (tokenTypes.indexOf(iterator.current.tokenType) < 0) {
            throw new NodeError(`${tokenName} expected but got "${iterator.current.tokenValue}"`, iterator.line, iterator.column);
        }

        return iterator.current;
    }
}