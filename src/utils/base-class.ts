/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 15, 2022
 */

/** */

import { TClass } from '../interfaces/types/class';

export default class BaseClass {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private components: Map<Function, unknown>;

    constructor() {
        this.components = new Map();
    }

    public setComponent<T>(_cls: TClass<T>, _instance: T) {
        this.components.set(_cls, _instance);
    }

    public getComponent<T>(_cls: TClass<T>) {
        const c = this.components.get(_cls);

        if (c == null) {
            return null;
        }

        return c as T;
    }
}
