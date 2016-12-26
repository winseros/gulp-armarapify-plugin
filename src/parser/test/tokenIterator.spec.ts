import { tokenTypes } from './../tokens/tokenTypes';
import { TokenIterator } from '../tokenIterator';

describe('tokenIterator', () => {
    describe('moveNext', () => {
        it('should iterate through the tokens', () => {
            const data = 'class MyClass { myProperty1="string-value"; \r\n myProperty2=12345; \r myProperty3[]={1,2};\n}; \r\n ';
            const iterator = new TokenIterator(new Buffer(data));

            //line 0
            let next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.word);
            expect(iterator.current.tokenValue).toEqual('class');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(0);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(0);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.word);
            expect(iterator.current.tokenValue).toEqual('MyClass');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(6);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(6);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.codeBlockStart);
            expect(iterator.current.tokenValue).toEqual('{');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(14);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(14);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.word);
            expect(iterator.current.tokenValue).toEqual('myProperty1');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(16);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(16);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.equals);
            expect(iterator.current.tokenValue).toEqual('=');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(27);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(27);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.string);
            expect(iterator.current.tokenValue).toEqual('string-value');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(28);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(28);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.semicolon);
            expect(iterator.current.tokenValue).toEqual(';');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(42);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(42);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.cr);
            expect(iterator.current.tokenValue).toEqual('\r');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(44);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(44);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.lf);
            expect(iterator.current.tokenValue).toEqual('\n');
            expect(iterator.current.lineNumber).toEqual(0);
            expect(iterator.current.colNumber).toEqual(45);
            expect(iterator.line).toEqual(0);
            expect(iterator.column).toEqual(45);
            expect(iterator.depleted).toEqual(false);

            //line 1
            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.word);
            expect(iterator.current.tokenValue).toEqual('myProperty2');
            expect(iterator.current.lineNumber).toEqual(1);
            expect(iterator.current.colNumber).toEqual(1);
            expect(iterator.line).toEqual(1);
            expect(iterator.column).toEqual(1);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.equals);
            expect(iterator.current.tokenValue).toEqual('=');
            expect(iterator.current.lineNumber).toEqual(1);
            expect(iterator.current.colNumber).toEqual(12);
            expect(iterator.line).toEqual(1);
            expect(iterator.column).toEqual(12);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.number);
            expect(iterator.current.tokenValue).toEqual(12345);
            expect(iterator.current.lineNumber).toEqual(1);
            expect(iterator.current.colNumber).toEqual(13);
            expect(iterator.line).toEqual(1);
            expect(iterator.column).toEqual(13);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.semicolon);
            expect(iterator.current.tokenValue).toEqual(';');
            expect(iterator.current.lineNumber).toEqual(1);
            expect(iterator.current.colNumber).toEqual(18);
            expect(iterator.line).toEqual(1);
            expect(iterator.column).toEqual(18);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.cr);
            expect(iterator.current.tokenValue).toEqual('\r');
            expect(iterator.current.lineNumber).toEqual(1);
            expect(iterator.current.colNumber).toEqual(20);
            expect(iterator.line).toEqual(1);
            expect(iterator.column).toEqual(20);
            expect(iterator.depleted).toEqual(false);

            //line 2
            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.word);
            expect(iterator.current.tokenValue).toEqual('myProperty3');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(1);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(1);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.squareBracketOpen);
            expect(iterator.current.tokenValue).toEqual('[');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(12);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(12);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.squareBracketClose);
            expect(iterator.current.tokenValue).toEqual(']');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(13);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(13);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.equals);
            expect(iterator.current.tokenValue).toEqual('=');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(14);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(14);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.codeBlockStart);
            expect(iterator.current.tokenValue).toEqual('{');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(15);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(15);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.number);
            expect(iterator.current.tokenValue).toEqual(1);
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(16);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(16);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.comma);
            expect(iterator.current.tokenValue).toEqual(',');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(17);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(17);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.number);
            expect(iterator.current.tokenValue).toEqual(2);
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(18);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(18);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.codeBlockEnd);
            expect(iterator.current.tokenValue).toEqual('}');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(19);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(19);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.semicolon);
            expect(iterator.current.tokenValue).toEqual(';');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(20);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(20);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.lf);
            expect(iterator.current.tokenValue).toEqual('\n');
            expect(iterator.current.lineNumber).toEqual(2);
            expect(iterator.current.colNumber).toEqual(21);
            expect(iterator.line).toEqual(2);
            expect(iterator.column).toEqual(21);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.codeBlockEnd);
            expect(iterator.current.tokenValue).toEqual('}');
            expect(iterator.current.lineNumber).toEqual(3);
            expect(iterator.current.colNumber).toEqual(0);
            expect(iterator.line).toEqual(3);
            expect(iterator.column).toEqual(0);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.semicolon);
            expect(iterator.current.tokenValue).toEqual(';');
            expect(iterator.current.lineNumber).toEqual(3);
            expect(iterator.current.colNumber).toEqual(1);
            expect(iterator.line).toEqual(3);
            expect(iterator.column).toEqual(1);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.cr);
            expect(iterator.current.tokenValue).toEqual('\r');
            expect(iterator.current.lineNumber).toEqual(3);
            expect(iterator.current.colNumber).toEqual(3);
            expect(iterator.line).toEqual(3);
            expect(iterator.column).toEqual(3);
            expect(iterator.depleted).toEqual(false);

            next = iterator.moveNext(); expect(next).toEqual(true);
            expect(iterator.current.tokenType).toEqual(tokenTypes.lf);
            expect(iterator.current.tokenValue).toEqual('\n');
            expect(iterator.current.lineNumber).toEqual(3);
            expect(iterator.current.colNumber).toEqual(4);
            expect(iterator.line).toEqual(3);
            expect(iterator.column).toEqual(4);
            expect(iterator.depleted).toEqual(false);

            expect(iterator.moveNext()).toEqual(false);
            expect(iterator.depleted).toEqual(true);
        });
    });
});
