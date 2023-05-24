/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 15, 2023
 */

/** */

import { Class } from '../interfaces/types/class';

export default class BaseClass {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private components: Map<Function, unknown>;

    constructor() {
        this.components = new Map();
    }

    public setComponent<T>(cls: Class<T>, instance: T) {
        this.components.set(cls, instance);
    }

    public getComponent<T>(cls: Class<T>) {
        const c = this.components.get(cls);

        if (c == null) {
            return null;
        }

        return c as T;
    }
}
