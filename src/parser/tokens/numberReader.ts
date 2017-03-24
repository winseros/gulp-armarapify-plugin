import { ParserError } from './../parserError';
import { TokenReader } from './tokenReader';
import { Token } from './token';
import { Iterator } from '../iterator';
import { tokenTypes } from './tokenTypes';
import { regexp } from './regexp';
import { mathOperators } from '../../mathOperators';

const symbolDot = '.';
const symbolE = 'e';

interface ReaderContext {
    value: string;
    success: boolean;
    float: boolean;
    scientific: boolean;
}

export class NumberReader implements TokenReader<number> {
    static readonly intMax = 2147483647;

    public read(iterator: Iterator<string>): Token<number> | undefined {
        const looksLikeANumber = iterator.current === symbolDot || regexp.digit.test(iterator.current);
        if (!looksLikeANumber) {
            return undefined;
        }

        const token = {
            lineNumber: iterator.line,
            colNumber: iterator.column,
            index: iterator.index
        } as Token<number>;

        const checkpoint = iterator.createCheckpoint();
        const context = this._read(iterator);

        if (!context.success) {
            checkpoint.restore();
            return undefined;
        }

        token.tokenValue = parseFloat(context.value);
        if (isNaN(token.tokenValue)) {
            throw new ParserError(`Couldn't convert value "${context.value}" into a number`, token.lineNumber, token.colNumber, token.index);
        }

        const float = token.tokenValue > NumberReader.intMax
            || ((context.float || context.scientific) && token.tokenValue.toString().includes(symbolDot));

        token.tokenType = float ? tokenTypes.float : tokenTypes.integer;

        return token;
    }

    private _read(iterator: Iterator<string>): ReaderContext {
        const context = {
            value: iterator.current,
            float: iterator.current === symbolDot,
            success: true
        } as ReaderContext;

        while (iterator.moveNext()) {
            if (iterator.current === symbolDot) {
                this._inflateFloatPart(iterator, context);
            } else if (iterator.current.toLowerCase() === symbolE) {
                const success = this._inflateScientificPart(iterator, context);
                if (!success) { break; }
            } else if (regexp.digit.test(iterator.current)) {
                context.value += iterator.current;
            } else if (regexp.letter.test(iterator.current)) {
                context.success = false;//that was not a number but a word starting with a digit
                break;
            } else {
                break;
            }
        }

        return context;
    }

    private _inflateFloatPart(iterator: Iterator<string>, context: ReaderContext): void {
        if (context.float) {
            const msg = `Found a duplicating "${symbolDot}" symbol in a number`;
            throw new ParserError(msg, iterator.line, iterator.column, iterator.index);
        }
        if (context.scientific) {
            const msg = `A number can not contain a "${symbolDot}" after a "${symbolE}"`;
            throw new ParserError(msg, iterator.line, iterator.column, iterator.index);
        }

        context.float = true;
        context.value += iterator.current;

        this._inflateDigit(iterator, context);
    }

    private _inflateScientificPart(iterator: Iterator<string>, context: ReaderContext): boolean {
        if (context.scientific) {
            const msg = `Found a duplicating "${symbolE}" symbol in a number`;
            throw new ParserError(msg, iterator.line, iterator.column, iterator.index);
        }

        context.scientific = true;
        context.value += iterator.current;

        if (iterator.moveNext()) {
            if (iterator.current === mathOperators.plus || iterator.current === mathOperators.minus) {
                context.value += iterator.current;
                this._inflateDigit(iterator, context);
            } else if (regexp.digit.test(iterator.current)) {
                context.value += iterator.current;
            } else {
                context.success = false;//that was not a number but a word starting with a digit
            }
        } else {
            context.success = false;
        }

        return context.success;
    }

    private _inflateDigit(iterator: Iterator<string>, context: ReaderContext): void {
        if (!iterator.moveNext()) {
            throw new ParserError('A digit expected but got EOF', iterator.line, iterator.column, iterator.index);
        }

        if (!regexp.digit.test(iterator.current)) {
            const symbolCode = iterator.current.charCodeAt(0);
            const msg = `A digit expected but got "${iterator.current}", code: ${symbolCode}`;
            throw new ParserError(msg, iterator.line, iterator.column, iterator.index);
        }

        context.value += iterator.current;
    }
}