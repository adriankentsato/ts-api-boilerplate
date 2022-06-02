/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 15, 2022
 */

/** */

import { TClass } from '../interfaces/types/class';
import { TNullable } from '../interfaces/types/nullable';

export default class BaseClass {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private components: Map<Function, unknown>;

    constructor() {
        this.components = new Map();
    }

    protected setComponent<T>(_cls: TClass<T>, _instance: T) {
        this.components.set(_cls, _instance);
    }

    protected getComponent<T>(_cls: TClass<T>): TNullable<T> {
        const c = this.components.get(_cls);

        if (c == null) {
            return null;
        }

        return c as T;
    }

    public SetComponent<T>(_cls: TClass<T>, _instance: T) {
        this.setComponent(_cls, _instance);
    }

    public GetComponent<T>(_cls: TClass<T>) {
        return this.getComponent(_cls);
    }
}
