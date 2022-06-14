/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */

import { randomUUID as uuid } from 'node:crypto';

import BaseClass from './base-class';
import { TPromisable } from '../interfaces/functions/promisable';
import { TResult } from '../interfaces/types/result';
import SuccessResponse from '../errors/success-response';
import { TFunction } from '../interfaces/types/function';
import { IResponse } from '../interfaces/types/response';
import { IRequest } from '../interfaces/types/request';
import ApiReponse from '../errors/api-response';
import ErrorResponse from '../errors/error-response';

export default class Controller extends BaseClass {
    protected readonly processId: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected middlewares: TFunction<TPromisable<TResult>>[];

    constructor(processId: string = uuid()) {
        super();

        this.processId = processId || uuid();
        this.middlewares = [];
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected handler(_req: IRequest): TPromisable<TResult<SuccessResponse>> {
        return {
            ok: false,
            error: new Error('Unimplemented method.'),
        };
    }

    // eslint-disable-next-line class-methods-use-this
    protected clean(): TPromisable<TResult<null>> {
        return { ok: true, value: null };
    }

    private async run(_req: IRequest): Promise<IResponse> {
        let response;

        try {
            let res;

            await this.middlewares.reduce(
                (p, c) =>
                    p.then(async () => {
                        let mw = c(_req);

                        if (mw instanceof Promise) {
                            mw = await mw;
                        }

                        if (!mw.ok) {
                            return Promise.reject(mw.error);
                        }

                        return Promise.resolve();
                    }),
                Promise.resolve(),
            );

            res = this.handler(_req);

            if (res instanceof Promise) {
                res = await res;
            }

            if (!res.ok) {
                throw res.error;
            }

            response = res.value;
        } catch (e) {
            if (e instanceof ApiReponse) {
                response = e;
            } else {
                response = new ErrorResponse('SERVER_ERROR', 'Server Error');
            }
        } finally {
            let cln = this.clean();

            if (cln instanceof Promise) {
                cln = await cln;
            }

            if (!cln.ok) {
                console.error('Clean not successful.', cln.error);
            }
        }

        return {
            code: response.StatusCode,
            headers: response.Headers,
            message: response.message,
            processId: this.processId,
            data: response.Data,
        };
    }

    public Execute(_req: IRequest) {
        return this.run(_req);
    }
}
