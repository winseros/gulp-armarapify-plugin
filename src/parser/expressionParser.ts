import { Node } from './nodes/node';
import { TokenIterator } from './tokenIterator';
import { ReaderUtility } from './nodes/readers/readerUtility';
import { ExpressionReader } from './nodes/readers/expressionReader';
import { tokenTypes } from './tokens/tokenTypes';

export class ExpressionParser {
    parseExpression(expressionString: Buffer): Node {
        const iterator = new TokenIterator(expressionString);

        const utility = new ReaderUtility(iterator);
        utility.skip(tokenTypes.whitespace).moveToNextToken();//either proceed or throw

        const reader = new ExpressionReader(utility);
        const node = reader.readExpression();
        return node;
    }
}