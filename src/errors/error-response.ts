/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */
import ApiReponse from './api-response';

export default class ErrorResponse extends ApiReponse {
    public constructor(errCode: string, message: string, statusCode: number = 500) {
        super(
            {
                response: {},
                error: {
                    code: errCode,
                    message,
                },
            },
            statusCode,
        );
    }
}
