import { ClassNode } from './nodes/classNode';
import { FileReader } from './nodes/readers/fileReader';
import { ReaderUtility } from './nodes/readers/readerUtility';
import { TokenIterator } from './tokenIterator';

export class TreeParser {
    private _reader = new FileReader('');

    parseFile(fileContents: Buffer): ClassNode {
        const node = this._reader.read(new ReaderUtility(new TokenIterator(fileContents)));
        return node;
    }
}