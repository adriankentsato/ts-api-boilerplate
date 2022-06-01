/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 15, 2022
 */

/** */

import ErrorResponse from '../errors/error-response';
import { IGenericType } from '../interfaces/types/generictype';
import { Handler } from '../interfaces/functions/handler';
import { IRequest } from '../interfaces/types/request';
import BaseClass from './base-class';
import ApiReponse from '../errors/api-response';

export default class BaseHandler extends BaseClass {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private middlewares: Handler[];

    constructor() {
        super();

        this.middlewares = [];

        Object.defineProperty(this, 'run', {
            writable: false,
            configurable: false,
            value: this.run,
        });
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected async handle(_req: IRequest): Promise<IGenericType> {
        // Implement this on the derived class.
        throw new Error('Unimplemented Code.');
    }

    // eslint-disable-next-line class-methods-use-this
    protected async cleanComponents() {
        // Implement this on the derived class.
        throw new Error('Unimplemented Code.');
    }

    public addMiddleware(middlware: Handler) {
        this.middlewares.push(middlware);
    }

    public async run(req: IRequest) {
        let response = null;

        for (let i = 0; i < this.middlewares.length; i += 1) {
            const mw = this.middlewares[i];

            try {
                // Run the middleware.
                let val = mw(req);

                // We'll check if the returned value is a promise;
                //      then we'll get the actual value.
                if (val instanceof Promise) {
                    // eslint-disable-next-line no-await-in-loop
                    val = await val;
                }

                // Check if the middleware returns something; wrap it to result.
                if (val != null) {
                    // Do a pre-check if the returned value is already a result.
                    response = val;
                    break; // We will break out of this loop since we got something.
                }
            } catch (e) {
                response = e;
                break; // We will break out of this loop since there's an error.
            }
        }

        // Check if the middlewares got something for us; if there's any let's
        //      return to the client immediately.
        if (response) {
            return this.cleanUp(response);
        }

        response = await this.handle(req)
            .then((res) => res)
            .catch((e) => e);

        return this.cleanUp(response);
    }

    private async cleanUp(response: Error): Promise<ApiReponse> {
        this.middlewares = [];

        await this.cleanComponents().catch(() => {});

        if (response instanceof ApiReponse) {
            if (response instanceof ErrorResponse) {
                // TODO: revert changes?
            }

            return response;
        }

        // All errors that are not of ApiResponse are Server Errors by default.
        return new ErrorResponse('SERVER_ERROR', 'Server Error', 500);
    }
}
