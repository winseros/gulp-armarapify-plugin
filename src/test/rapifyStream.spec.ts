import { RapifyStream } from '../rapifyStream';
import { Readable, Writable } from 'stream';
import File = require('vinyl');

describe('rapifyStream', () => {
    describe('_transform', () => {
        it('should transform text into binary form', (done: Function) => {
            const data = 'prop1=1;prop2=2;class Inner{cProp1=3;cProp2=4;};';
            let file = new File({ contents: Buffer.from(data) });

            const stream = new Readable({
                objectMode: true,
                read: () => 0
            });
            stream.pipe(new RapifyStream()).pipe(new Writable({
                objectMode: true,
                write: (rapFile: any, encoding: string, callback: Function) => {
                    done();
                }
            }));
            stream.push(file);
        });
    });
});
