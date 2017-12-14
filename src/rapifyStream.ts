import { constants } from './constants';
import { PluginError } from 'gulp-util';
import { Transform } from 'stream';
import File = require('vinyl');
import { TreeParser } from './parser/treeParser';
import { TreeOptimizer } from './optimizer/treeOptimizer';
import { TreeSerizlizer } from './serializer/treeSerializer';
import { ParserError } from './parser/parserError';
import { NodeError } from './parser/nodeError';
import { EOL } from 'os';
import * as chalk from 'chalk';

export type TransformCallback = (err?: Error, file?: File) => void;
export type ErrorWithLineNumber = ParserError | NodeError;

export class RapifyStream extends Transform {
    static readonly errorContextLength = 40;

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

        let err;
        if (!file.isBuffer()) {
            err = new PluginError(constants.pluginName, 'Streaming input is not supported', { fileName: file.relative });
            return callback(err);
        }

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
        const context = this._getParserContext(file, error.index);
        const message = `${file.relative}(${line}:${column}): ${error.message}${EOL}at ${context}`;
        return new PluginError({
            plugin: constants.pluginName,
            message: message,
            name: error.name
        });
    }

    _getParserContext(file: File, index: number): string {
        const contents = file.contents as Buffer;

        let startIndex = 0;
        let startSequence = '';
        if (index > RapifyStream.errorContextLength) {
            startIndex = index - RapifyStream.errorContextLength;
            startSequence = '...';
        }

        let endIndex = index + RapifyStream.errorContextLength;
        let endSequence = '...';
        if (endIndex >= contents.length - 1) {
            endIndex = contents.length - 1;
            endSequence = '';
        }

        const substr = Buffer.allocUnsafe(endIndex - startIndex + 1);
        contents.copy(substr, 0, startIndex);

        const str = chalk.yellow(`\"${startSequence}${substr.toString()}${endSequence}\"`);
        return str;
    }
}