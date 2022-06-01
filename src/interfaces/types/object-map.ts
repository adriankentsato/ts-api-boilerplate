/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */
export interface IObjectMap<T> {
    [key: string]: T;
}

export type IObjectKeysMap<KeyList extends Readonly<string[]>, T> = {
    [K in KeyList[number]]: T;
};
