/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 24, 2023
 */

/** */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TResult<T = any, E = Error> = { ok: true; value: T } | { ok: false; error: E };
