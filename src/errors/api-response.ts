/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2023
 */

/** */
import { IGenericType } from '../interfaces/types/generictype';

export default class ApiReponse extends Error {
    public readonly data: string;

    public readonly statusCode: number;

    public readonly headers: IGenericType;

    public constructor(
        data: IGenericType = {},
        statusCode: number = 200,
        headers: IGenericType = { 'Content-Type': 'application/json' },
    ) {
        super();

        this.data = JSON.stringify(data);
        this.statusCode = statusCode;
        this.headers = headers;
    }
}
