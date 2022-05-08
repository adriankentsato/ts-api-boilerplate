/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2023
 */

/** */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<T = any> = new (...args: any[]) => T;
