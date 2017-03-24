import { NodeReader } from './nodeReader';
import { NodeError } from '../../nodeError';
import { ReaderUtility } from './readerUtility';

export class Readers {
    private _readers: NodeReader[] = [];

    registerReader(reader: NodeReader): Readers {
        this._readers.push(reader);
        return this;
    }

    pickReader(reader: ReaderUtility): NodeReader {
        for (const registeredReader of this._readers) {
            const canRead = registeredReader.canRead(reader);
            if (canRead) {
                return registeredReader;
            }
        }

        const iterator = reader.iterator;
        const message = `Unexpected token: \"${iterator.current.tokenValue}\", type: ${iterator.current.tokenType}`;
        throw new NodeError(message, iterator.line, iterator.column, iterator.index);
    }
}