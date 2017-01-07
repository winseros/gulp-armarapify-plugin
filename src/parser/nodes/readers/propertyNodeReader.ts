import { NodeReader } from './nodeReader';
import { Node } from '../node';
import { PropertyNode } from '../propertyNode';
import { tokenTypes } from '../../tokens/tokenTypes';
import { Token } from '../../tokens/token';
import { PropertyReaders } from './propertyReaders';
import { ReaderUtility } from './readerUtility';

export class PropertyNodeReader extends NodeReader {
    private _registry = PropertyReaders.instance;

    canRead(reader: ReaderUtility): boolean {
        const current = reader.iterator.current;
        const canRead = current.tokenType === tokenTypes.word && (current.tokenValue as string).toLowerCase() !== 'class';
        return canRead;
    }

    read(reader: ReaderUtility): Node {
        const propertyNameToken = reader.iterator.current as Token<string>;

        reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();
        const nodeReader = this._registry.pickReader(reader);
        const propertyValue = nodeReader.read(reader);

        return new PropertyNode(propertyNameToken.tokenValue, propertyValue as Node);
    }
}