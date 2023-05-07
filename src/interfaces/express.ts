/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2023
 */

/** */
import { IRequest } from './request';
import { IResponse } from './response';

/* eslint-disable @typescript-eslint/no-explicit-any */
type NextFunction = (err?: Error | any) => void | Promise<any> | any;

export type ExpressFunction = (request: IRequest, response: IResponse, next: NextFunction) => void | Promise<any> | any;
/* eslint-enable @typescript-eslint/no-explicit-any */
