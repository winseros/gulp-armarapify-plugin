import { constants } from './constants';
import { PluginError } from 'gulp-util';
import { Transform } from 'stream';
import File = require('vinyl');

export type TransformCallback = (err: Error, file?: File) => void;

export class RapifyStream extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(file: File, encoding: string, callback: TransformCallback): void {
        if (file.isStream()) {
            callback(new PluginError(constants.pluginName, 'Streaming input is not supported', { fileName: file.basename }));
            return;
        }
    }
}