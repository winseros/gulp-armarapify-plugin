import { ClassReaderBase } from './classReaderBase';
import { Node } from '../node';
import { ClassNode } from '../classNode';
import { ReaderUtility } from './readerUtility';

export class FileReader extends ClassReaderBase {
    private _fileName: string;

    constructor(fileName: string) {
        super();
        this._fileName = fileName;
    }

    canRead(reader: ReaderUtility): boolean {
        throw new Error('Not implemented');
    }

    read(reader: ReaderUtility): Node {
        const children = this._readClassChildren(reader);
        const node = new ClassNode(this._fileName, children);
        return node;
    }
}