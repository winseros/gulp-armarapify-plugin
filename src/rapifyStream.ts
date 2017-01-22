import { constants } from './constants';
import { PluginError } from 'gulp-util';
import { Transform } from 'stream';
import File = require('vinyl');
import { TreeParser } from './parser/treeParser';
import { TreeSerizlizer } from './serializer/treeSerializer';
import { ParserError } from './parser/parserError';
import { NodeError } from './parser/nodeError';

export type TransformCallback = (err?: Error, file?: File) => void;
export type ErrorWithLineNumber = ParserError | NodeError;

export class RapifyStream extends Transform {
    private _treeParser = new TreeParser();
    private _serializer = new TreeSerizlizer();

    constructor() {
        super({ objectMode: true });
    }

    _transform(file: File, encoding: string, callback: TransformCallback): void {
        if (file.isStream()) {
            callback(new PluginError(constants.pluginName, 'Streaming input is not supported', { fileName: file.basename }));
            return;
        }

        try {
            const tree = this._treeParser.parseFile(file.contents as Buffer);
            file.contents = this._serializer.serialize(tree);
            callback(undefined, file);
        } catch (ex) {
            const err = this._convertError(ex as Error, file);
            callback(err);
        }
    }

    _convertError(error: Error, file: File): PluginError {
        let res: PluginError;
        if (error instanceof ParserError || error instanceof NodeError) {
            res = this._convertParserError(error as ErrorWithLineNumber, file);
        } else {
            res = this._convertArbitraryError(error, file);
        }
        return res;
    }

    _convertArbitraryError(error: Error, file: File): PluginError {
        return new PluginError({
            plugin: constants.pluginName,
            error: error,
            fileName: file.basename,
        });
    }

    _convertParserError(error: ErrorWithLineNumber, file: File): PluginError {
        const message = `[${error.line}:${error.comumn}] ${error.message}`;
        return new PluginError({
            plugin: constants.pluginName,
            message: message,
            fileName: file.basename,
            name: error.name,
            lineNumber: error.line
        });
    }
}