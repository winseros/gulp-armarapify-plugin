import { NodeReader } from './nodeReader';
import { Node } from '../node';
import { ArrayNode } from '../arrayNode';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { ExpressionReader } from './expressionReader';

export class ArrayNodeReader extends NodeReader {
    canRead(reader: ReaderUtility): boolean {
        const canRead = reader.iterator.current.tokenType === tokenTypes.squareBracketOpen;
        return canRead;
    }

    read(reader: ReaderUtility): Node {
        reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken(']', tokenTypes.squareBracketClose);
        reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken('=', tokenTypes.equals);
        reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken('{', tokenTypes.codeBlockStart);

        const result = this._readArray(reader);

        reader.skip(tokenTypes.whitespace).nextToken(';', tokenTypes.semicolon);

        return result;
    }

    _readArray(reader: ReaderUtility): Node {
        const children = this._readArrayChildren(reader);
        return new ArrayNode(children);
    }

    _readArrayChildren(reader: ReaderUtility): Node[] {
        const result = [] as Array<Node>;
        const expressionReader = new ExpressionReader(reader);

        while (true) {
            reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();

            const isEmbeddedArray = reader.iterator.current.tokenType === tokenTypes.codeBlockStart;
            const node = isEmbeddedArray ? this._readArray(reader) : expressionReader.readExpression(', or )', tokenTypes.comma, tokenTypes.bracketClose);
            result.push(node);

            const next = reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken(', or }', tokenTypes.comma, tokenTypes.codeBlockEnd);
            if (next.tokenType === tokenTypes.codeBlockEnd) {
                break;
            }
        }

        return result;
    }
}