import { Iterator } from './../../iterator';
import { ReadersCollection } from '../readersCollection';

describe('parser/tokens/readersCollection', () => {
    describe('read', () => {
        it('should return a token from appropriate reader', () => {
            const r1 = jasmine.createSpyObj('reader1', ['read']);
            const r2 = jasmine.createSpyObj('reader1', ['read']);
            const r3 = jasmine.createSpyObj('reader1', ['read']);

            const r1read = r1.read as jasmine.Spy;
            const r2read = r2.read as jasmine.Spy;
            const r3read = r3.read as jasmine.Spy;

            const token = { prop: 'value' } as any;
            r2read.and.returnValue(token);

            const collection = new ReadersCollection();
            collection.registerReader(r1)
                .registerReader(r2)
                .registerReader(r3);

            const iterator = { current: 'x' } as Iterator<string>;

            const result = collection.read(iterator);
            expect(result).toBe(token);

            expect(r1read).toHaveBeenCalledTimes(1);
            expect(r1read).toHaveBeenCalledWith(iterator);

            expect(r2read).toHaveBeenCalledTimes(1);
            expect(r2read).toHaveBeenCalledWith(iterator);

            expect(r3read).not.toHaveBeenCalled();
        });

        it('should throw if can not pick a reader', () => {
            const r1 = jasmine.createSpyObj('reader1', ['read']);
            const r2 = jasmine.createSpyObj('reader1', ['read']);

            const r1read = r1.read as jasmine.Spy;
            const r2read = r2.read as jasmine.Spy;

            const registry = new ReadersCollection();
            registry.registerReader(r1)
                .registerReader(r2);

            const iterator = { current: 'x' } as Iterator<string>;

            expect(() => registry.read(iterator)).toThrowError('Unexpected symbol: "x", code: 120');

            expect(r1read).toHaveBeenCalledTimes(1);
            expect(r1read).toHaveBeenCalledWith(iterator);

            expect(r2read).toHaveBeenCalledTimes(1);
            expect(r2read).toHaveBeenCalledWith(iterator);
        });
    });
});
