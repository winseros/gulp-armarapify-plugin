import { TokenReader } from './tokenReader';
import { CharIterator } from '../charIterator';

export class ReaderRegistry {
    private static _instance: ReaderRegistry;
    static get instance(): ReaderRegistry {
        if (!ReaderRegistry._instance) {
            ReaderRegistry._instance = new ReaderRegistry();
        }
        return ReaderRegistry._instance;
    }

    private _readers: TokenReader[] = [];

    registerReader(reader: TokenReader): void {
        this._readers.push(reader);
    }

    pickReader(iterator: CharIterator): TokenReader {
        for (let i = 0; i < this._readers.length; i++) {
            const reader = this._readers[i];
            const canRead = reader.canRead(iterator);
            if (canRead) {
                return reader;
            }
        }
        const symbolCode = iterator.current.charCodeAt(0);
        const message = `Couldn't find an appropriate reader by the symbol: \"${iterator.current}\", code: ${symbolCode}`;
        throw new Error(message);
    }
}