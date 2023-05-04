/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { Promisable } from './promisable';
import { IRequest } from './request';
import { IReponse } from './response';

export type Handler = (request: IRequest) => Promisable<IReponse>;
