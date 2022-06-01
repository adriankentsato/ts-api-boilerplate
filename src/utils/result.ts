/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 24, 2022
 */

/** */

import { TResult } from '../interfaces/types/result';

export default class Result {
    static ok<T>(value: T): Readonly<TResult<T>> {
        return Object.freeze({ ok: true, value });
    }

    static err<E>(error: E): Readonly<TResult<null, E>> {
        return Object.freeze({ ok: false, error });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isResult(data: any = {}): boolean {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            return false;
        }

        const { ok, value, error, ...rest } = data;

        // Reject if there are unexpected keys
        if (Object.keys(rest).length > 0 || typeof ok !== 'boolean') {
            return false;
        }

        // Enforce mutual exclusivity
        const hasValue = typeof value !== 'undefined';
        const hasError = typeof error !== 'undefined';

        if (ok) {
            return hasValue && !hasError;
        }

        return hasError && !hasValue;
    }
}
