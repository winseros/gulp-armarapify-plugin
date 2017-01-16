import { ClassReaders } from './classReaders';
import { Node } from '../node';
import { ClassNode } from '../classNode';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';

export class FileReader {
    private _readerRegistry = ClassReaders.instance;
    private _fileName: string;

    constructor(fileName: string) {
        this._fileName = fileName;
    }

    read(reader: ReaderUtility): Node {
        const children = this._readClassChildren(reader);
        const node = new ClassNode(this._fileName, children);
        return node;
    }

    _readClassChildren(reader: ReaderUtility): Node[] {
        const result = [] as Node[];

        while (true) {
            const eof = reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextTokenOrEof();
            if (eof) {
                break;
            }

            const childReader = this._readerRegistry.pickReader(reader);
            const child = childReader.read(reader);
            result.push(child);
        }

        return result;
    }
}