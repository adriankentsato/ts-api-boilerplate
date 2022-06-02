/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */
import { IGenericType } from '../interfaces/types/generictype';

export default class ApiReponse extends Error {
    public readonly data: string;

    public readonly statusCode: number;

    public readonly headers: IGenericType;

    public constructor(
        _data: IGenericType = {},
        _statusCode: number = 200,
        _headers: IGenericType = { 'Content-Type': 'application/json' },
    ) {
        super();

        this.data = JSON.stringify(_data);
        this.statusCode = _statusCode;
        this.headers = _headers;
    }
}
