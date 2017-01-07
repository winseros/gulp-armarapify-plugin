import { Readers } from './readers';
import { ArrayNodeReader } from './arrayNodeReader';
import { ExpressionNodeReader } from './expressionNodeReader';

export class PropertyReaders extends Readers {
    private static _instance: PropertyReaders;
    static get instance(): PropertyReaders {
        if (!PropertyReaders._instance) {
            PropertyReaders._instance = new PropertyReaders();
            PropertyReaders._registerReaders(PropertyReaders._instance);
        }
        return PropertyReaders._instance;
    }

    static _registerReaders(registry: PropertyReaders): void {
        registry.registerReader(new ArrayNodeReader())
            .registerReader(new ExpressionNodeReader());
    }
}