import { Token } from './token';
import { TokenReader } from './tokenReader';
import { WhitespaceReader } from './whitespaceReader';
import { NewLineReader } from './newLineReader';
import { CommentReader } from './commentReader';
import { ControlCharReader } from './controlCharReader';
import { StringReader } from './stringReader';
import { NumberReader } from './numberReader';
import { HexReader } from './hexReader';
import { WordReader } from './wordReader';
import { Iterator } from '../iterator';
import { ParserError } from '../parserError';

export class ReadersCollection {
    private static _instance: ReadersCollection;
    static get instance(): ReadersCollection {
        if (!ReadersCollection._instance) {
            ReadersCollection._instance = new ReadersCollection();
            ReadersCollection._registerReaders(ReadersCollection._instance);
        }
        return ReadersCollection._instance;
    }

    static _registerReaders(registry: ReadersCollection): void {
        registry.registerReader(new WhitespaceReader())
            .registerReader(new NewLineReader())
            .registerReader(new CommentReader())
            .registerReader(new ControlCharReader())
            .registerReader(new StringReader())
            .registerReader(new NumberReader())
            .registerReader(new HexReader())
            .registerReader(new WordReader());
    }

    private _readers: TokenReader<any>[] = [];

    registerReader(reader: TokenReader<any>): ReadersCollection {
        this._readers.push(reader);
        return this;
    }

    read(iterator: Iterator<string>): Token<any> {
        let result: Token<any> | undefined;

        for (const reader of this._readers) {
            result = reader.read(iterator);
            if (result) {
                return result;
            }
        }

        const symbolCode = iterator.current.charCodeAt(0);
        const message = `Unexpected symbol: \"${iterator.current}\", code: ${symbolCode}`;
        throw new ParserError(message, iterator.line, iterator.column, iterator.index);
    }
}