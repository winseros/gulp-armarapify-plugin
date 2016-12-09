import { Transform } from 'stream';
import File = require('vinyl');

export type TransformCallback = (err: Error, file: File) => void;

export class RapifyStream extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(file: File, encoding: string, callback: TransformCallback): void { }
}