import { TokenIterator } from './../tokenIterator';
import { Token } from './../tokens/token';
import { tokenTypes } from './../tokens/tokenTypes';
import { NodeError } from './../nodeError';

const defaultNonSenseTokenTypes = [tokenTypes.comment, tokenTypes.cr, tokenTypes.lf];

export class ReaderUtility {
    nextToken(iterator: TokenIterator, errorDescription: string, ...expectedTypes: string[]) {
        this.moveToNextSensitiveToken(iterator, errorDescription);

        if (expectedTypes.indexOf(iterator.current.tokenType) < 0) {
            throw new NodeError(`${errorDescription} expected but got "${iterator.current.tokenValue}"`, iterator.line, iterator.column);
        }

        return iterator.current;
    }

    nextTokenOnCurrentLine(iterator: TokenIterator, errorDescription: string, ...expectedTypes: string[]): Token<string | number> {
        this.moveToNextSensitiveToken(iterator, errorDescription, tokenTypes.comment);

        if (iterator.current.tokenType === tokenTypes.cr || iterator.current.tokenType === tokenTypes.lf) {
            throw new NodeError(`${errorDescription} expected but got EOL`, iterator.line, iterator.column);
        }

        if (expectedTypes.indexOf(iterator.current.tokenType) < 0) {
            throw new NodeError(`${errorDescription} expected but got "${iterator.current.tokenValue}"`, iterator.line, iterator.column);
        }

        return iterator.current;
    }

    moveToNextSensitiveToken(iterator: TokenIterator, errorDescription: string, ...nonSenseTokenTypes: string[]): void {
        const eof = this.moveToNextSensitiveTokenOrEof(iterator, errorDescription, ...nonSenseTokenTypes);
        if (eof) {
            throw new NodeError(`${errorDescription} expected but got EOF`, iterator.line, iterator.column);
        }
    }

    moveToNextSensitiveTokenOrEof(iterator: TokenIterator, errorDescription: string, ...nonSenseTokenTypes: string[]): boolean {
        let eof = true;

        if (!nonSenseTokenTypes.length) {
            nonSenseTokenTypes = defaultNonSenseTokenTypes;
        }

        while (iterator.moveNext()) {
            if (nonSenseTokenTypes.indexOf(iterator.current.tokenType) >= 0) {
                continue;
            }
            eof = false;
            break;
        }

        return eof;
    }
}

export const readerUtility = new ReaderUtility();