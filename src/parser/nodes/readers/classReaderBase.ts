import { NodeReader } from './nodeReader';
import { Node } from '../node';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { ClassReaders } from './classReaders';

export abstract class ClassReaderBase extends NodeReader {
    private _readerRegistry = ClassReaders.instance;

    _readClassChildren(reader: ReaderUtility): Node[] {
        const result = [] as Node[];

        while (true) {
            reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();

            if (reader.iterator.current.tokenType === tokenTypes.codeBlockEnd) {
                reader.skip(tokenTypes.whitespace).nextToken(';', tokenTypes.semicolon);
                break;
            }

            const childReader = this._readerRegistry.pickReader(reader);
            const child = childReader.read(reader);
            result.push(child);
        }

        return result;
    }
}