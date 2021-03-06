import { NodeReader } from './nodeReader';
import { Node } from '../node';
import { ArrayNode } from '../arrayNode';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { ExpressionReader } from './expressionReader';

export class ArrayNodeReader implements NodeReader {
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
        const result = [] as Node[];
        const expressionReader = new ExpressionReader(reader);

        while (true) {
            reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();

            if (reader.iterator.current.tokenType === tokenTypes.codeBlockEnd) {
                break;
            }

            let node: Node;
            const isEmbeddedArray = reader.iterator.current.tokenType === tokenTypes.codeBlockStart;
            if (isEmbeddedArray) {
                node = this._readArray(reader);
                reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();
            } else {
                node = expressionReader.readExpression(tokenTypes.comma, tokenTypes.codeBlockEnd, tokenTypes.newline);
            }

            result.push(node);

            if (reader.iterator.current.tokenType === tokenTypes.codeBlockEnd) {
                break;
            }
        }

        return result;
    }
}