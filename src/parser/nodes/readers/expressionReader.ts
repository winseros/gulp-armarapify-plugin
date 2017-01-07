import { Node } from '../node';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';

export class ExpressionReader {
    private _utility: ReaderUtility;

    constructor(utility: ReaderUtility) {
        this._utility = utility;
    }

    readExpression(): Node {
        return {} as Node;
    }
}