import { ClassNode } from './classNode';
import { Node } from './node';
import { ValueNode } from './valueNode';
import { ArrayNode } from './arrayNode';
import { NodeError } from './../nodeError';
import { TokenIterator } from './../tokenIterator';
import { Token } from './../tokens/token';
import { tokenTypes } from './../tokens/tokenTypes';
import { readerUtility } from './readerUtility';

export class ClassReader {
    private _iterator: TokenIterator;

    constructor(buffer: Buffer) {
        this._iterator = new TokenIterator(buffer);
    }

    readClassNodes(): Node[] {
        const result = [] as Node[];

        while (true) {
            const eof = readerUtility.moveToNextSensitiveTokenOrEof(this._iterator, 'Some token');
            if (eof) {
                break;
            }

            const tokenType = this._iterator.current.tokenType;
            if (tokenType === tokenTypes.codeBlockEnd) {
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

    _readNextWord(iterator: TokenIterator, token: Token<any>): Node {
        const current = iterator.current as Token<string>;
        const result = current.tokenValue.toLowerCase() === 'class'
            ? this._readNextClass(iterator)
            : this._readNextProperty(current.tokenValue, iterator);
        return result;
    }

    _readNextClass(iterator: TokenIterator): Node {
        const classNameToken = readerUtility.nextTokenOnCurrentLine(iterator, 'Class name', tokenTypes.word);

        const nextToken = readerUtility.nextToken(iterator, '{ or :', tokenTypes.codeBlockStart, tokenTypes.colon);

        let inheritsToken: Token<string> | undefined;
        if (nextToken.tokenType === tokenTypes.colon) {
            inheritsToken = readerUtility.nextToken(iterator, 'Base class name', tokenTypes.word) as Token<string>;
            readerUtility.nextToken(iterator, '{', tokenTypes.codeBlockStart);
        }

        const children = this.readClassNodes();

        readerUtility.nextTokenOnCurrentLine(iterator, ';', tokenTypes.semicolon);

        const className = classNameToken.tokenValue as string;
        const inherits = inheritsToken ? inheritsToken.tokenValue : undefined;
        return new ClassNode(className, children, inherits);
    }

    _readNextProperty(propertyName: string, iterator: TokenIterator): Node {
        const next = readerUtility.nextToken(iterator, '= or [', tokenTypes.equals, tokenTypes.squareBracketOpen);

        let result: Node;
        if (next.tokenType === tokenTypes.equals) {
            const value = this._readValueProperty(iterator);
            result = new ValueNode(propertyName, value);
        } else {
            const arr = this._readArrayProperty(iterator);
            result = new ArrayNode(propertyName, arr);
        }

        readerUtility.nextTokenOnCurrentLine(iterator, ';', tokenTypes.semicolon);
        return result;
    }

    _readValueProperty(iterator: TokenIterator): string | number {
        const token = readerUtility.nextToken(iterator, 'string or number', tokenTypes.string, tokenTypes.number);
        return token.tokenValue;
    }

    _readArrayProperty(iterator: TokenIterator): Array<string | number> {
        readerUtility.nextToken(iterator, ']', tokenTypes.squareBracketClose);
        readerUtility.nextToken(iterator, '=', tokenTypes.equals);
        readerUtility.nextToken(iterator, '{', tokenTypes.codeBlockStart);

        const result = [] as Array<string | number>;
        let next = readerUtility.nextToken(iterator, 'string, number, }', tokenTypes.string, tokenTypes.number, tokenTypes.codeBlockEnd);

        while (next.tokenType !== tokenTypes.codeBlockEnd) {
            if (next.tokenType === tokenTypes.string || next.tokenType === tokenTypes.number) {
                result.push(next.tokenValue);
                next = readerUtility.nextToken(iterator, '} or ,', tokenTypes.codeBlockEnd, tokenTypes.comma);
            } else {
                next = readerUtility.nextToken(iterator, 'string or number', tokenTypes.string, tokenTypes.number);
            }
        }

        return result;
    }
}