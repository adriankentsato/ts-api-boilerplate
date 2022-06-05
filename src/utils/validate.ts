/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */

import { validationResult } from 'express-validator';
import { ExpressFunction } from '../interfaces/functions/express';
import { Handler } from '../interfaces/functions/handler';
import ErrorResponse from '../errors/error-response';
import { IResponse } from '../interfaces/types/response';
import { TResult } from '../interfaces/types/result';

/** This uses the express-validator to check for the data valididty. */
export default function validate(_mw: ExpressFunction): Handler {
    return (_req) =>
        new Promise<TResult>((resolve) => {
            console.info('[Validation] Checking for the validity of your data.');
            _mw(_req, {} as unknown as IResponse, (error) => {
                if (error != null) resolve({ ok: false, error });
                else {
                    const x = validationResult(_req);

                    if (!x.isEmpty()) {
                        const err = x.array()[0];

                        console.error('[Validation] Error: ', err.msg);

                        resolve({ ok: false, error: new ErrorResponse('BAD REQUEST', 'Bad Request', 400) });
                    } else {
                        console.info('[Validation] Validation okay.');

                        resolve({ ok: true, value: 'Validation succeeded.' });
                    }
                }
            });
        });
}
