import { constants } from './constants';
import { PluginError } from 'gulp-util';
import { Transform } from 'stream';
import File = require('vinyl');
import { TreeParser } from './parser/treeParser';
import { TreeOptimizer } from './optimizer/treeOptimizer';
import { TreeSerizlizer } from './serializer/treeSerializer';
import { ParserError } from './parser/parserError';
import { NodeError } from './parser/nodeError';

export type TransformCallback = (err?: Error, file?: File) => void;
export type ErrorWithLineNumber = ParserError | NodeError;

export class RapifyStream extends Transform {
    private _treeParser = new TreeParser();
    private _serializer = new TreeSerizlizer();
    private _optimizer = new TreeOptimizer();

    constructor() {
        super({ objectMode: true });
    }

    _transform(file: File, encoding: string, callback: TransformCallback): void {
        if (file.isNull()) {
            return callback(undefined, file);
        }

        if (!file.isBuffer()) {
            const err = new PluginError(constants.pluginName, 'Streaming input is not supported', { fileName: file.relative });
            return callback(err);
        }

        let err;
        try {
            const tree = this._treeParser.parseFile(file.contents as Buffer);
            this._optimizer.optimize(tree);
            file.contents = this._serializer.serialize(tree);
        } catch (ex) {
            err = this._convertError(ex as Error, file);
        }

        callback(err, file);
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
            fileName: file.relative,
        });
    }

    _convertParserError(error: ErrorWithLineNumber, file: File): PluginError {
        const line = error.line + 1;
        const column = error.comumn + 1;
        const message = `${file.relative}(${line}:${column}): ${error.message}`;
        return new PluginError({
            plugin: constants.pluginName,
            message: message,
            fileName: file.relative,
            name: error.name,
            lineNumber: line
        });
    }
}