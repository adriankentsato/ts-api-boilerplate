/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2022
 */

/** */
import { TPromisable } from './promisable';
import { IRequest } from '../types/request';
import { IResponse } from '../types/response';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (request: IRequest) => TPromisable<void | IResponse | any>;
