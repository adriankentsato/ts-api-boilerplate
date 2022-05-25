/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { Writable } from 'node:stream';
import { IGenericType } from './generictype';

export interface IResponse {
    code: number;
    headers: IGenericType;
    message: string;
    processId: string;
    data?: IGenericType | string | Writable;
}
