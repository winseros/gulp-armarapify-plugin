import { ReaderUtility } from './readerUtility';
import { Node } from '../node';

export abstract class NodeReader {
    abstract canRead(reader: ReaderUtility): boolean;

    abstract read(reader: ReaderUtility): Node;
}