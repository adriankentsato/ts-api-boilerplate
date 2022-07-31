/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IObjectMap<T = any> {
    [key: string]: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IObjectKeysMap<KeyList extends Readonly<string[]>, T = any> = {
    [K in KeyList[number]]: T;
};
