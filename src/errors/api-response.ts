/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */
import { IGenericType } from '../interfaces/types/generictype';

export default class ApiReponse extends Error {
    public readonly Data: string;

    public readonly StatusCode: number;

    public readonly Headers: IGenericType;

    public constructor(
        _data: IGenericType = {},
        _statusCode: number = 200,
        _headers: IGenericType = { 'Content-Type': 'application/json' },
    ) {
        super();

        this.Data = JSON.stringify(_data);
        this.StatusCode = _statusCode;
        this.Headers = _headers;
    }
}
