/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TClass<T> = new (...args: any[]) => T;
