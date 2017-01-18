import { ReaderUtility } from './readerUtility';
import { Node } from '../node';

export interface NodeReader {
    canRead(reader: ReaderUtility): boolean;

    read(reader: ReaderUtility): Node;
}