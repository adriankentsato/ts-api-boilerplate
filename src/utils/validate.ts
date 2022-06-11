/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */

import { body, ValidationChain, validationResult } from 'express-validator';
import { randomUUID as uuid } from 'node:crypto';

import { ExpressFunction } from '../interfaces/functions/express';
import { Handler } from '../interfaces/functions/handler';
import ErrorResponse from '../errors/error-response';
import { IResponse } from '../interfaces/types/response';
import { TResult } from '../interfaces/types/result';
import { IGenericType } from '../interfaces/types/generictype';
import { IRequest } from '../interfaces/types/request';

/** This uses the express-validator to check for the data valididty. */

export default {};

export function validate(_mw: ExpressFunction): Handler {
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

export function check(
    _data: IGenericType,
    _errMsg: string,
    _mw: (validator: ValidationChain) => ValidationChain,
): Promise<boolean> {
    const req: IRequest = { body: { data: _data }, headers: {}, ipAddress: '', method: '' };

    return new Promise((resolve) => {
        const serial = uuid();

        let chk: IGenericType<ValidationChain>;

        console.info('[Check] Checking your data if valid.');

        chk = body('data', _errMsg);
        chk.generated_serial_key = serial;
        chk = _mw(chk);

        if (chk.generated_serial_key !== serial) {
            console.error('[Check] Error: You returned a new validation chain.');
            resolve(false);
        } else {
            chk(req, {} as unknown as IResponse, (error) => {
                if (error != null) resolve(false);
                else {
                    const x = validationResult(req);

                    if (!x.isEmpty()) {
                        const err = x.array()[0];

                        console.error('[Check] Error: ', err.msg);

                        resolve(false);
                    } else {
                        console.info('[Check] Check okay.');

                        resolve(true);
                    }
                }
            });
        }
    });
}
