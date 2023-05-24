/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IGenericType<T = any> = T & { [key: string]: IGenericType };
