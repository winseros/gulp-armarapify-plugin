import { ReaderUtility } from '../readerUtility';
import { Readers } from '../readers';
import { TokenIterator } from '../../../tokenIterator';
import { Token } from '../../../tokens/token';

describe('parser/nodes/readers/readers', () => {
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

            const registry = new Readers();
            registry.registerReader(r1)
                .registerReader(r2)
                .registerReader(r3);

            const readerUtility = {} as ReaderUtility;

            const reader = registry.pickReader(readerUtility);
            expect(reader).toBe(r2);

            expect(r1read).toHaveBeenCalledTimes(1);
            expect(r1read).toHaveBeenCalledWith(readerUtility);

            expect(r2read).toHaveBeenCalledTimes(1);
            expect(r2read).toHaveBeenCalledWith(readerUtility);

            expect(r3read).not.toHaveBeenCalled();
        });

        it('should throw if can not pick a reader', () => {
            const r1 = jasmine.createSpyObj('reader1', ['canRead']);
            const r2 = jasmine.createSpyObj('reader1', ['canRead']);

            const r1read = r1.canRead as jasmine.Spy;
            const r2read = r2.canRead as jasmine.Spy;
            r1read.and.returnValue(false);
            r2read.and.returnValue(false);

            const registry = new Readers();
            registry.registerReader(r1)
                .registerReader(r2);

            const readerUtility = {
                iterator: {
                    current: {
                        tokenType: 'some-token-type',
                        tokenValue: 'some-token-value'
                    } as Token<string>
                } as TokenIterator
            } as ReaderUtility;

            expect(() => registry.pickReader(readerUtility)).toThrowError('Unexpected token: "some-token-value", type: some-token-type');

            expect(r1read).toHaveBeenCalledTimes(1);
            expect(r1read).toHaveBeenCalledWith(readerUtility);

            expect(r2read).toHaveBeenCalledTimes(1);
            expect(r2read).toHaveBeenCalledWith(readerUtility);
        });
    });
});
