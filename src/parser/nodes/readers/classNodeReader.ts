import { NodeReader } from './nodeReader';
import { ClassReaders } from './classReaders';
import { Node } from '../node';
import { ClassNode } from '../classNode';
import { ExternNode } from '../externNode';
import { tokenTypes } from '../../tokens/tokenTypes';
import { ReaderUtility } from './readerUtility';
import { Token } from '../../tokens/token';

export class ClassNodeReader implements NodeReader {
    private _readerRegistry = ClassReaders.instance;

    canRead(reader: ReaderUtility): boolean {
        const current = reader.iterator.current;
        const canRead = current.tokenType === tokenTypes.word && (current.tokenValue as string).toLowerCase() === 'class';
        return canRead;
    }

    read(reader: ReaderUtility): Node {
        const className = reader.skip(tokenTypes.whitespace).nextToken('Class name', tokenTypes.word) as Token<string>;

        const nextToken = reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken('{ or : or ;', tokenTypes.codeBlockStart, tokenTypes.colon, tokenTypes.semicolon);

        if (nextToken.tokenType === tokenTypes.semicolon) {
            return new ExternNode(className.tokenValue);
        }

        let inheritsToken: Token<string> | undefined;
        if (nextToken.tokenType === tokenTypes.colon) {
            inheritsToken = reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken('Base class name', tokenTypes.word) as Token<string>;
            reader.skip(tokenTypes.whitespace, tokenTypes.newline).nextToken('{', tokenTypes.codeBlockStart);
        }

        const children = this._readClassChildren(reader);

        const inherits = inheritsToken ? inheritsToken.tokenValue : undefined;

        return new ClassNode(className.tokenValue, children, inherits);
    }

    _readClassChildren(reader: ReaderUtility): Node[] {
        const result = [] as Node[];

        while (true) {
            reader.skip(tokenTypes.whitespace, tokenTypes.newline).moveToNextToken();

            if (reader.iterator.current.tokenType === tokenTypes.codeBlockEnd) {
                const checkpoint = reader.iterator.createCheckpoint();
                const eof = reader.skip(tokenTypes.whitespace).moveToNextTokenOrEof();
                if (eof || reader.iterator.current.tokenType !== tokenTypes.semicolon) {//optional ; at the end of class
                    checkpoint.restore();
                }
                break;
            }

            const childReader = this._readerRegistry.pickReader(reader);
            const child = childReader.read(reader);
            result.push(child);
        }

        return result;
    }
}