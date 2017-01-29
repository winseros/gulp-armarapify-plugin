import { RapifyStream } from '../rapifyStream';
import { Readable, Writable } from 'stream';
import * as path from 'path';
import File = require('vinyl');
import { PluginError } from 'gulp-util';
import { ParserError } from '../parser/parserError';
import { NodeError } from '../parser/nodeError';
import { TreeParser } from '../parser/treeParser';

describe('rapifyStream', () => {
    describe('_transform', () => {
        it('should throw in case of streaming input', (done: Function) => {
            const file = new File({ base: './src', path: path.normalize('/src/file.js') });
            spyOn(file, 'isStream').and.returnValue(true);

            const stream = new Readable({ objectMode: true, read: () => 0 });
            stream
                .pipe(new RapifyStream())
                .on('error', (err: Error) => {
                    expect(err instanceof PluginError).toEqual(true);
                    expect(err.message).toEqual('Streaming input is not supported');
                    done();
                });

            stream.push(file);
        });

        it('should transform text into binary form', (done: Function) => {
            const data = 'prop1=1;prop2=2;class Inner{cProp1=3;cProp2=8 - 4;};';
            const file = new File({ contents: Buffer.from(data) });

            const stream = new Readable({ objectMode: true, read: () => 0 });
            stream.pipe(new RapifyStream()).pipe(new Writable({
                objectMode: true,
                write: (chunk: any, encoding: string, callback: Function) => {
                    expect(chunk).toBe(file);

                    const expected = [
                        0x00, 0x72, 0x61, 0x50, 0x00, 0x00, 0x00, 0x00, 0x8, 0x00, 0x00, 0x00, 0x59, 0x00, 0x00, 0x00, 0x00, 0x03, 0x01, 0x02, 0x70, 0x72, 0x6f, 0x70, 0x31,
                        0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x02, 0x70, 0x72, 0x6f, 0x70, 0x32, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x49, 0x6e, 0x6e, 0x65, 0x72, 0x00, 0x39,
                        0x00, 0x00, 0x00, 0x39, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01, 0x02, 0x63, 0x50, 0x72, 0x6f, 0x70, 0x31, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x02, 0x63,
                        0x50, 0x72, 0x6f, 0x70, 0x32, 0x00, 0x04, 0x00, 0x00, 0x00, 0x59, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
                    ];

                    expect(file.contents).toEqual(Buffer.from(expected));
                    done();
                }
            }));
            stream.push(file);
        });

        it('should handle errors', (done: Function) => {
            const handledError = new PluginError('some-plugin', 'some-error-message');
            spyOn(RapifyStream.prototype, '_convertError').and.returnValue(handledError);

            const thrownError = new ParserError('some error', 100, 500);
            spyOn(TreeParser.prototype, 'parseFile').and.callFake(() => { throw thrownError; });

            const file = new File();
            const stream = new Readable({ objectMode: true, read: () => 0 });
            stream
                .pipe(new RapifyStream())
                .on('error', (err: Error) => {
                    expect(err).toBe(handledError);
                    expect(RapifyStream.prototype._convertError).toHaveBeenCalledTimes(1);
                    expect(RapifyStream.prototype._convertError).toHaveBeenCalledWith(thrownError, file);
                    done();
                });

            stream.push(file);
        });
    });

    describe('_convertError', () => {
        it('should handle ParserErrors', () => {
            const file = new File({ base: './src', path: path.normalize('/src/file.js') });
            const err = new ParserError('error-msg', 100, 500);

            const stream = new RapifyStream();
            const converted = stream._convertError(err, file);

            expect(converted instanceof PluginError).toEqual(true);
            expect(converted.message).toEqual(`${file.relative}(101:501): error-msg`);
            expect(converted.fileName).toEqual(file.relative);
            expect(converted.name).toEqual(err.name);
            expect(converted.lineNumber).toEqual(101);
            expect(converted.stack).toBeFalsy();
        });

        it('should handle NodeErrors', () => {
            const file = new File({ base: './src', path: path.normalize('/src/file.js') });
            const err = new NodeError('error-msg', 100, 500);

            const stream = new RapifyStream();
            const converted = stream._convertError(err, file);

            expect(converted instanceof PluginError).toEqual(true);
            expect(converted.message).toEqual(`${file.relative}(101:501): error-msg`);
            expect(converted.fileName).toEqual(file.relative);
            expect(converted.name).toEqual(err.name);
            expect(converted.lineNumber).toEqual(101);
            expect(converted.stack).toBeFalsy();
        });

        it('should handle other errors', () => {
            const file = new File({ base: './src', path: path.normalize('/src/file.js') });
            const err = new Error('error-msg');

            const stream = new RapifyStream();
            const converted = stream._convertError(err, file);

            expect(converted instanceof PluginError).toEqual(true);
            expect(converted.message).toEqual('error-msg');
            expect(converted.fileName).toEqual(file.relative);
            expect(converted.stack).toBeTruthy();
        });
    });
});
