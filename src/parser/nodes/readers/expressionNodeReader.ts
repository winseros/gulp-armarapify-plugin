import { NodeReader } from './nodeReader';
import { Node } from '../node';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { ExpressionReader } from './expressionReader';

export class ExpressionNodeReader implements NodeReader {
    canRead(reader: ReaderUtility): boolean {
        const canRead = reader.iterator.current.tokenType === tokenTypes.equals;
        return canRead;
    }

    read(reader: ReaderUtility): Node {
        reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();
        const expressionReader = new ExpressionReader(reader);
        const expression = expressionReader.readExpression(tokenTypes.semicolon);
        return expression;
    }
}