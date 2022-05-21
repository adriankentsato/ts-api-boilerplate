/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2023
 */

/** */

import { validationResult } from 'express-validator';
import { ExpressFunction } from '../interfaces/express';
import { Handler } from '../interfaces/handler';
import ErrorResponse from '../errors/error-response';
import { IResponse } from '../interfaces/response';

/** This uses the express-validator to check for the data valididty. */
export default function validate(mw: ExpressFunction): Handler {
    return (req) =>
        new Promise<void>((resolve, reject) => {
            console.info('[Validation Check] Checking for the validity of your data.');
            mw(req, {} as unknown as IResponse, (error) => {
                if (error != null) reject(error);
                else {
                    const x = validationResult(req);

                    if (!x.isEmpty()) {
                        const err = x.array()[0];

                        console.error('[Validation Error]', err.msg);

                        reject(new ErrorResponse('BAD REQUEST', 'Bad Request', 400));
                    } else {
                        console.info('[Validation Succeeded] Validation okay.');

                        resolve();
                    }
                }
            });
        });
}
