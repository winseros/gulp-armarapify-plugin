import { Token } from '../token';
import { Iterator } from '../../iterator';
import { ReaderBase } from '../readerBase';

class Reader<T> extends ReaderBase<T> {
    constructor(
        private _canReadImpl: (iterator: Iterator<string>) => boolean,
        private _readImpl: (iterator: Iterator<string>) => Token<T>
    ) {
        super();
    }

    _canRead(iterator: Iterator<string>): boolean {
        return this._canReadImpl(iterator);
    }

    _read(iterator: Iterator<string>): Token<T> {
        return this._readImpl(iterator);
    }
}

describe('parser/tokens/readerBase', () => {
    describe('read', () => {
        it('should return undefined if _canRead returns false', () => {
            const read = jasmine.createSpy('read');
            const canRead = jasmine.createSpy('read');
            canRead.and.returnValue(false);

            const iterator = { prop: 'iterator' } as any;

            const reader = new Reader<string>(canRead, read);
            expect(reader.read(iterator)).not.toBeDefined();

            expect(canRead).toHaveBeenCalledTimes(1);
            expect(canRead).toHaveBeenCalledWith(iterator);

            expect(read).not.toHaveBeenCalled();
        });

        it('should return token if _canRead returns true', () => {
            const read = jasmine.createSpy('read');
            const canRead = jasmine.createSpy('read');

            const token = { prop: 'token' } as any;
            read.and.returnValue(token);
            canRead.and.returnValue(true);

            const iterator = { prop: 'iterator' } as any;
            const reader = new Reader<string>(canRead, read);
            expect(reader.read(iterator)).toBe(token);

            expect(canRead).toHaveBeenCalledTimes(1);
            expect(canRead).toHaveBeenCalledWith(iterator);

            expect(read).toHaveBeenCalledTimes(1);
            expect(read).toHaveBeenCalledWith(iterator);
        });
    });
});
