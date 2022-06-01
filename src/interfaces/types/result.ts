/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 24, 2022
 */

/** */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TResult<T = any, E = Error> = { ok: true; value: T } | { ok: false; error: E };
