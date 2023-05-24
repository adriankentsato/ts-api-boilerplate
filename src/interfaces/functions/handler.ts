/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { Promisable } from './promisable';
import { IRequest } from '../types/request';
import { IResponse } from '../types/response';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (request: IRequest) => void | Promisable<void | IResponse | any> | IResponse | any;
