import { Readers } from './readers';
import { ClassNodeReader } from './classNodeReader';
import { DeleteNodeReader } from './deleteNodeReader';
import { PropertyNodeReader } from './propertyNodeReader';

export class ClassReaders extends Readers {
    private static _instance: ClassReaders;
    static get instance(): ClassReaders {
        if (!ClassReaders._instance) {
            ClassReaders._instance = new ClassReaders();
            ClassReaders._registerReaders(ClassReaders._instance);
        }
        return ClassReaders._instance;
    }

    static _registerReaders(registry: ClassReaders): void {
        registry.registerReader(new ClassNodeReader())
            .registerReader(new DeleteNodeReader())
            .registerReader(new PropertyNodeReader());
    }
}