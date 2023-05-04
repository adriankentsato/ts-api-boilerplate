/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { Readable } from 'node:stream';

import { IGenericType } from './generictype';

export interface IRequest {
    method: string;
    headers: IGenericType;
    ipAddress: string;
    body?: IGenericType | string | Readable;
    query?: IGenericType;
    params?: IGenericType;
}
