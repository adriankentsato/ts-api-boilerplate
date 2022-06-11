/*!
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 09, 2022
 */

/** */
import { IObjectMap } from '../interfaces/types/object-map';

/**
 * This will get the list of unique keys from the list of keys provided by the list of items.
 *  TLDR: Flattens array and gets the unique sets.
 * @param _modelKeys List of keys/fields available for the model
 * @param _keyList List of keys in a list of items that you wanted to get
 * @returns The list of keys that the caller only wanted to get
 */
export default function GetModelFieldList(
    _modelKeys: Readonly<Array<string>>,
    _keyList: Array<Array<string>>,
): IObjectMap<0> {
    const fields: IObjectMap<0> = {};

    for (let i = 0, cnt = 0; i < _keyList.length && cnt < _modelKeys.length; i += 1) {
        let s;

        s = _keyList[i];

        if (s.length === 0) {
            s = _modelKeys;
        }

        s.forEach((k) => {
            // Let's account for duplicated key
            if (fields[k] == null) {
                cnt += 1;
            }

            fields[k] = 0;
        });
    }

    return fields;
}
