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
        for (let i = 0; i < this._readers.length; i++) {
            const registeredReader = this._readers[i];
            const canRead = registeredReader.canRead(reader);
            if (canRead) {
                return registeredReader;
            }
        }

        const iterator = reader.iterator;
        const message = `Couldn't find an appropriate reader by the token: \"${iterator.current.tokenValue}\", type: ${iterator.current.tokenType}`;
        throw new NodeError(message, iterator.line, iterator.column);
    }
}