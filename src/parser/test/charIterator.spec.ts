import { CharIterator } from '../CharIterator';

describe('parser/charIterator', () => {

    describe('ctor', () => {
        it('should set depleted to false', () => {
            const input = new Buffer('abc');
            const iterator = new CharIterator(input);
            expect(iterator.depleted).toEqual(false);
        });

        it('should set depleted to true', () => {
            const input = new Buffer('');
            const iterator = new CharIterator(input);
            expect(iterator.depleted).toEqual(true);
        });
    });

    describe('moveNext', () => {
        it('should iterate through values', () => {
            const input = new Buffer('abc');
            const iterator = new CharIterator(input);

            expect(iterator.current).not.toBeDefined();

            let hasCurrent = iterator.moveNext();
            expect(hasCurrent).toEqual(true);
            expect(iterator.current).toEqual('a');
            expect(iterator.depleted).toEqual(false);

            hasCurrent = iterator.moveNext();
            expect(hasCurrent).toEqual(true);
            expect(iterator.current).toEqual('b');
            expect(iterator.depleted).toEqual(false);

            hasCurrent = iterator.moveNext();
            expect(hasCurrent).toEqual(true);
            expect(iterator.current).toEqual('c');
            expect(iterator.depleted).toEqual(false);

            hasCurrent = iterator.moveNext();
            expect(hasCurrent).toEqual(false);
            expect(iterator.depleted).toEqual(true);
        });

        it('should update column', () => {
            const input = new Buffer('abc');
            const iterator = new CharIterator(input);

            iterator.moveNext();
            expect(iterator.column).toEqual(0);
            expect(iterator.line).toEqual(0);

            iterator.moveNext();
            expect(iterator.column).toEqual(1);
            expect(iterator.line).toEqual(0);

            iterator.moveNext();
            expect(iterator.column).toEqual(2);
            expect(iterator.line).toEqual(0);
        });

        it('should update line and column', () => {
            const input = new Buffer('ab\rcd\nef\r\ngh');
            const iterator = new CharIterator(input);

            iterator.moveNext();
            expect(iterator.column).toEqual(0);
            expect(iterator.line).toEqual(0);//a

            iterator.moveNext();
            expect(iterator.column).toEqual(1);
            expect(iterator.line).toEqual(0);//b

            iterator.moveNext();
            expect(iterator.column).toEqual(2);
            expect(iterator.line).toEqual(0);//\r

            iterator.moveNext();
            expect(iterator.column).toEqual(0);
            expect(iterator.line).toEqual(1);//c

            iterator.moveNext();
            expect(iterator.column).toEqual(1);
            expect(iterator.line).toEqual(1);//d

            iterator.moveNext();
            expect(iterator.column).toEqual(2);
            expect(iterator.line).toEqual(1);//\n

            iterator.moveNext();
            expect(iterator.column).toEqual(0);
            expect(iterator.line).toEqual(2);//e

            iterator.moveNext();
            expect(iterator.column).toEqual(1);
            expect(iterator.line).toEqual(2);//f

            iterator.moveNext();
            expect(iterator.column).toEqual(2);
            expect(iterator.line).toEqual(2);//\r

            iterator.moveNext();
            expect(iterator.column).toEqual(3);
            expect(iterator.line).toEqual(2);//\n

            iterator.moveNext();
            expect(iterator.column).toEqual(0);
            expect(iterator.line).toEqual(3);//g

            iterator.moveNext();
            expect(iterator.column).toEqual(1);
            expect(iterator.line).toEqual(3);//h
        });
    });

    describe('createCheckpoint', () => {
        it('should create a restorable checkpoint', () => {
            const input = new Buffer('ab');
            const iterator = new CharIterator(input);

            iterator.moveNext();
            const checkpoint = iterator.createCheckpoint();

            expect(checkpoint).toBeDefined();
        });
    });

    describe('__rollbackCheckpoint', () => {
        it('should create a restorable checkpoint', () => {
            const input = new Buffer('ab');
            const iterator = new CharIterator(input);

            iterator.moveNext();//set the iterator to some state

            const checkpoint = iterator.createCheckpoint();
            const startState = {
                current: iterator.current,
                line: iterator.line,
                column: iterator.column,
                depleted: iterator.depleted
            };

            iterator.moveNext();//change the iterator state
            checkpoint.restore();//restore the checkpoint

            const endState = {
                current: iterator.current,
                line: iterator.line,
                column: iterator.column,
                depleted: iterator.depleted
            };

            expect(startState).toEqual(endState);
        });
    });
});
