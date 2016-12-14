import { TokenReader } from './tokenReader';
import { ControlCharReader } from './controlCharReader';
import { StringReader } from './stringReader';
import { NumberReader } from './numberReader';
import { WordReader } from './wordReader';
import { Iterator } from '../iterator';
import { ParserError } from '../ParserError';

export class ReaderRegistry {
    private static _instance: ReaderRegistry;
    static get instance(): ReaderRegistry {
        if (!ReaderRegistry._instance) {
            ReaderRegistry._instance = new ReaderRegistry();
            ReaderRegistry._registerReaders(ReaderRegistry._instance);
        }
        return ReaderRegistry._instance;
    }

    static _registerReaders(registry: ReaderRegistry): void {
        registry.registerReader(new ControlCharReader())
            .registerReader(new StringReader())
            .registerReader(new NumberReader())
            .registerReader(new WordReader());
    }

    private _readers: TokenReader<any>[] = [];

    registerReader(reader: TokenReader<any>): ReaderRegistry {
        this._readers.push(reader);
        return this;
    }

    pickReader(iterator: Iterator<string>): TokenReader<any> {
        for (let i = 0; i < this._readers.length; i++) {
            const reader = this._readers[i];
            const canRead = reader.canRead(iterator);
            if (canRead) {
                return reader;
            }
        }
        const symbolCode = iterator.current.charCodeAt(0);
        const message = `Couldn't find an appropriate reader by the symbol: \"${iterator.current}\", code: ${symbolCode}`;
        throw new ParserError(message, iterator.line, iterator.column);
    }
}