import { ReaderUtility } from './../readerUtility';
import { tokenTypes } from './../../../tokens/tokenTypes';
import { Token } from '../../../tokens/token';
import { TokenIterator } from '../../../tokenIterator';
import { ExpressionReader } from '../expressionReader';
import { nodeTypes } from '../../nodeTypes';
import { StringNode } from '../../stringNode';
import { MathGrpNode } from '../../mathGrpNode';
import { MathOpNode } from '../../mathOpNode';
import { NumberNode } from '../../numberNode';

const implementFakeIterator = (iteratorMock: any, calls: Token<any>[]): any => {
    let callIndex = 0;
    return (): boolean => {
        iteratorMock.current = calls[callIndex];
        callIndex++;
        return !!iteratorMock.current;
    };
};

describe('parser/nodes/readers/expressionReader', () => {
    describe('readExpression', () => {
        it('should throw if no stopAt tokens specified', () => {
            const reader = new ExpressionReader({} as ReaderUtility);
            expect(() => reader.readExpression('something')).toThrowError('A set of tokens to stop at must be specified');
        });

        it('should throw if a math operator is missing', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            expect(() => reader.readExpression('not-matter', tokenTypes.semicolon)).toThrowError(`Math operator expected but was "2" of type "${tokenTypes.number}"`);
        });

        it('should throw if next token is unexpected', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.equals, tokenValue: '=', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            expect(() => reader.readExpression('not-matter', tokenTypes.semicolon)).toThrowError(`Unexpected token "=" of type "${tokenTypes.equals}"`);
        });

        it('should read "string" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.string, tokenValue: 'abc', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const str = expression as StringNode;
            expect(str.type).toEqual(nodeTypes.string);
            expect(str.value).toEqual('abc');
        });

        it('should read "a + b" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '+', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const plus = expression as MathOpNode;
            expect(plus.type).toEqual(nodeTypes.mathOp);
            expect(plus.operator).toEqual('+');

            const left = plus.left as NumberNode;
            expect(left.type).toEqual(nodeTypes.number);
            expect(left.value).toEqual(1);

            const right = plus.right as NumberNode;
            expect(right.type).toEqual(nodeTypes.number);
            expect(right.value).toEqual(2);
        });

        it('should read "a*b + c" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '*', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '-', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 3, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const minus = expression as MathOpNode;
            expect(minus.type).toEqual(nodeTypes.mathOp);
            expect(minus.operator).toEqual('-');

            const minusRight = minus.right as NumberNode;
            expect(minusRight.type).toEqual(nodeTypes.number);
            expect(minusRight.value).toEqual(3);

            const mul = minus.left as MathOpNode;
            expect(mul.type).toEqual(nodeTypes.mathOp);
            expect(mul.operator).toEqual('*');

            const mulLeft = mul.left as NumberNode;
            expect(mulLeft.type).toEqual(nodeTypes.number);
            expect(mulLeft.value).toEqual(1);

            const mulRight = mul.right as NumberNode;
            expect(mulRight.type).toEqual(nodeTypes.number);
            expect(mulRight.value).toEqual(2);
        });

        it('should read "a*b ^ c" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '*', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '^', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 3, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const mul = expression as MathOpNode;
            expect(mul.type).toEqual(nodeTypes.mathOp);
            expect(mul.operator).toEqual('*');

            const mulLeft = mul.left as NumberNode;
            expect(mulLeft.type).toEqual(nodeTypes.number);
            expect(mulLeft.value).toEqual(1);

            const exp = mul.right as MathOpNode;
            expect(exp.type).toEqual(nodeTypes.mathOp);
            expect(exp.operator).toEqual('^');

            const expLeft = exp.left as NumberNode;
            expect(expLeft.type).toEqual(nodeTypes.number);
            expect(expLeft.value).toEqual(2);

            const expRight = exp.right as NumberNode;
            expect(expRight.type).toEqual(nodeTypes.number);
            expect(expRight.value).toEqual(3);
        });

        it('should read "a + b*c" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '+', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '*', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 3, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const plus = expression as MathOpNode;
            expect(plus.type).toEqual(nodeTypes.mathOp);
            expect(plus.operator).toEqual('+');

            const plusLeft = plus.left as NumberNode;
            expect(plusLeft.type).toEqual(nodeTypes.number);
            expect(plusLeft.value).toEqual(1);

            const mul = plus.right as MathOpNode;
            expect(mul.type).toEqual(nodeTypes.mathOp);
            expect(mul.operator).toEqual('*');

            const mulLeft = mul.left as NumberNode;
            expect(mulLeft.type).toEqual(nodeTypes.number);
            expect(mulLeft.value).toEqual(2);

            const mulRight = mul.right as NumberNode;
            expect(mulRight.type).toEqual(nodeTypes.number);
            expect(mulRight.value).toEqual(3);
        });

        it('should read "(a + b) * c" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.bracketOpen, tokenValue: '(', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '+', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.bracketClose, tokenValue: ')', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '*', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 3, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const mul = expression as MathOpNode;
            expect(mul.type).toEqual(nodeTypes.mathOp);
            expect(mul.operator).toEqual('*');

            const mulRight = mul.right as NumberNode;
            expect(mulRight.type).toEqual(nodeTypes.number);
            expect(mulRight.value).toEqual(3);

            const grp = mul.left as MathGrpNode;
            expect(grp.type).toEqual(nodeTypes.mathGrp);

            const plus = grp.value as MathOpNode;
            expect(plus.type).toEqual(nodeTypes.mathOp);
            expect(plus.operator).toEqual('+');

            const plusLeft = plus.left as NumberNode;
            expect(plusLeft.type).toEqual(nodeTypes.number);
            expect(plusLeft.value).toEqual(1);

            const plusRight = plus.right as NumberNode;
            expect(plusRight.type).toEqual(nodeTypes.number);
            expect(plusRight.value).toEqual(2);
        });

        it('should read "((a / b))" expression', () => {
            const tokenIterator = jasmine.createSpyObj('tokenIteratorSpy', ['moveNext']) as TokenIterator;
            const spyMoveNext = tokenIterator.moveNext as jasmine.Spy;

            spyMoveNext.and.callFake(implementFakeIterator(tokenIterator, [
                { tokenType: tokenTypes.bracketOpen, tokenValue: '(', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.bracketOpen, tokenValue: '(', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 1, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.mathOp, tokenValue: '/', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.number, tokenValue: 2, lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.bracketClose, tokenValue: ')', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.bracketClose, tokenValue: ')', lineNumber: 0, colNumber: 0 },
                { tokenType: tokenTypes.semicolon, tokenValue: ';', lineNumber: 0, colNumber: 0 }
            ]));

            tokenIterator.moveNext();
            const reader = new ExpressionReader(new ReaderUtility(tokenIterator));
            const expression = reader.readExpression('not-matter', tokenTypes.semicolon);

            expect(expression).toBeDefined();

            const grp1 = expression as MathGrpNode;
            expect(grp1.type).toEqual(nodeTypes.mathGrp);

            const grp2 = grp1.value as MathGrpNode;
            expect(grp2.type).toEqual(nodeTypes.mathGrp);

            const div = grp2.value as MathOpNode;
            expect(div.type).toEqual(nodeTypes.mathOp);
            expect(div.operator).toEqual('/');

            const plusLeft = div.left as NumberNode;
            expect(plusLeft.type).toEqual(nodeTypes.number);
            expect(plusLeft.value).toEqual(1);

            const plusRight = div.right as NumberNode;
            expect(plusRight.type).toEqual(nodeTypes.number);
            expect(plusRight.value).toEqual(2);
        });
    });
});
