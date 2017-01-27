import { TokenReader } from './tokenReader';
import { WhitespaceReader } from './whitespaceReader';
import { NewLineReader } from './newLineReader';
import { CommentReader } from './commentReader';
import { ControlCharReader } from './controlCharReader';
import { StringReader } from './stringReader';
import { NumberReader } from './numberReader';
import { WordReader } from './wordReader';
import { Iterator } from '../iterator';
import { ParserError } from '../parserError';

export class TokenReaders {
    private static _instance: TokenReaders;
    static get instance(): TokenReaders {
        if (!TokenReaders._instance) {
            TokenReaders._instance = new TokenReaders();
            TokenReaders._registerReaders(TokenReaders._instance);
        }
        return TokenReaders._instance;
    }

    static _registerReaders(registry: TokenReaders): void {
        registry.registerReader(new WhitespaceReader())
            .registerReader(new NewLineReader())
            .registerReader(new CommentReader())
            .registerReader(new NumberReader())
            .registerReader(new StringReader())
            .registerReader(new ControlCharReader())
            .registerReader(new WordReader());
    }

    private _readers: TokenReader<any>[] = [];

    registerReader(reader: TokenReader<any>): TokenReaders {
        this._readers.push(reader);
        return this;
    }

    pickReader(iterator: Iterator<string>): TokenReader<any> {
        for (const reader of this._readers) {
            const canRead = reader.canRead(iterator);
            if (canRead) {
                return reader;
            }
        }
        const symbolCode = iterator.current.charCodeAt(0);
        const message = `Unexpected symbol: \"${iterator.current}\", code: ${symbolCode}`;
        throw new ParserError(message, iterator.line, iterator.column);
    }
}