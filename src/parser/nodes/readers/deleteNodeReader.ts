import { NodeReader } from './nodeReader';
import { Node } from '../node';
import { DeleteNode } from '../deleteNode';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { Token } from '../../tokens/token';

export class DeleteNodeReader implements NodeReader {
    canRead(reader: ReaderUtility): boolean {
        const current = reader.iterator.current;
        const canRead = current.tokenType === tokenTypes.word && (current.tokenValue as string).toLowerCase() === 'delete';
        return canRead;
    }

    read(reader: ReaderUtility): Node {
        const className = reader.skip(tokenTypes.whitespace).nextToken('Class name', tokenTypes.word) as Token<string>;

        reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken(';', tokenTypes.semicolon);

        return new DeleteNode(className.tokenValue);
    }
}