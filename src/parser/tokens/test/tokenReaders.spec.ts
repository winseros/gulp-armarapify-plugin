import { Iterator } from './../../iterator';
import { TokenReaders } from '../tokenReaders';

describe('parser/tokens/tokenReaders', () => {
    describe('pickReader', () => {
        it('should return an appropriate reader', () => {
            const r1 = jasmine.createSpyObj('reader1', ['canRead']);
            const r2 = jasmine.createSpyObj('reader1', ['canRead']);
            const r3 = jasmine.createSpyObj('reader1', ['canRead']);

            const r1read = r1.canRead as jasmine.Spy;
            const r2read = r2.canRead as jasmine.Spy;
            const r3read = r3.canRead as jasmine.Spy;
            r1read.and.returnValue(false);
            r2read.and.returnValue(true);

            const registry = new TokenReaders();
            registry.registerReader(r1)
                .registerReader(r2)
                .registerReader(r3);

            const iterator = { current: 'x' } as Iterator<string>;

            const reader = registry.pickReader(iterator);
            expect(reader).toBe(r2);

            expect(r1read).toHaveBeenCalledTimes(1);
            expect(r1read).toHaveBeenCalledWith(iterator);

            expect(r2read).toHaveBeenCalledTimes(1);
            expect(r2read).toHaveBeenCalledWith(iterator);

            expect(r3read).not.toHaveBeenCalled();
        });

        it('should throw if can not pick a reader', () => {
            const r1 = jasmine.createSpyObj('reader1', ['canRead']);
            const r2 = jasmine.createSpyObj('reader1', ['canRead']);

            const r1read = r1.canRead as jasmine.Spy;
            const r2read = r2.canRead as jasmine.Spy;
            r1read.and.returnValue(false);
            r2read.and.returnValue(false);

            const registry = new TokenReaders();
            registry.registerReader(r1)
                .registerReader(r2);

            const iterator = { current: 'x' } as Iterator<string>;

            expect(() => registry.pickReader(iterator)).toThrowError('Couldn\'t find an appropriate reader by the symbol: "x", code: 120');

            expect(r1read).toHaveBeenCalledTimes(1);
            expect(r1read).toHaveBeenCalledWith(iterator);

            expect(r2read).toHaveBeenCalledTimes(1);
            expect(r2read).toHaveBeenCalledWith(iterator);
        });
    });
});
