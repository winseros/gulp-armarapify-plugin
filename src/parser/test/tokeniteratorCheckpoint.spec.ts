import { TokenIterator } from '../tokenIterator';
import { CheckpointParams, TokenIteratorCheckpoint } from '../tokenIteratorCheckpoint';

describe('parser/tokenIteratorCheckpoint', () => {
    describe('restore', () => {
        it('should call the iterator method', () => {
            const params = {
                iterator: jasmine.createSpyObj('tokenIterator', ['__rollbackCheckpoint'])
            } as CheckpointParams;

            const checkpoint = new TokenIteratorCheckpoint(params);

            checkpoint.restore();

            expect(params.iterator.__rollbackCheckpoint).toHaveBeenCalledTimes(1);
            expect(params.iterator.__rollbackCheckpoint).toHaveBeenCalledWith(params);
        });
    });

    describe('createCheckpoint', () => {
        it('should throw an error', () => {
            const params = {} as CheckpointParams;

            const checkpoint = new TokenIteratorCheckpoint(params);

            expect(() => checkpoint.createCheckpoint()).toThrowError('Not implemented');
        });
    });

    describe('moveNext', () => {
        it('should call the iterator method', () => {
            const params = {
                iterator: jasmine.createSpyObj('tokenIterator', ['moveNext'])
            } as CheckpointParams;
            (params.iterator.moveNext as jasmine.Spy).and.returnValue('12345');

            const checkpoint = new TokenIteratorCheckpoint(params);

            const result = checkpoint.moveNext();
            expect(result).toEqual('12345' as any);

            expect(params.iterator.moveNext).toHaveBeenCalledTimes(1);
        });
    });

    describe('properties', () => {
        it('should equal the iterator properties', () => {
            const params = {
                iterator: {
                    current: '12345' as any,
                    line: 123,
                    column: 456,
                    index: 789,
                    depleted: 'abc' as any
                } as TokenIterator
            } as CheckpointParams;

            const checkpoint = new TokenIteratorCheckpoint(params);

            expect(checkpoint.current).toEqual('12345' as any);
            expect(checkpoint.line).toEqual(123);
            expect(checkpoint.column).toEqual(456);
            expect(checkpoint.index).toEqual(789);
            expect(checkpoint.depleted).toEqual('abc' as any);
        });
    });
});
