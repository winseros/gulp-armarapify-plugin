import { CharIterator } from '../CharIterator';

describe('parser/charIterator', () => {
    describe('next', () => {
        it('should return the iterator itself', () => {
            const input = new Buffer('abc');
            const iterator = new CharIterator(input);

            let next = iterator.next();
            expect(next).toBe(iterator);

            next = iterator.next();
            expect(next).toBe(iterator);
        });

        it('should update the "done" property', () => {
            const input = new Buffer('abc');
            const iterator = new CharIterator(input);

            expect(iterator.done).not.toBeDefined();

            iterator.next();
            expect(iterator.done).toEqual(false);

            iterator.next();
            expect(iterator.done).toEqual(false);

            iterator.next();
            expect(iterator.done).toEqual(false);

            iterator.next();
            expect(iterator.done).toEqual(true);
        });
    });
});
