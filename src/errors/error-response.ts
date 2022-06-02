/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */
import ApiReponse from './api-response';

export default class ErrorResponse extends ApiReponse {
    constructor(_code: string, _message: string, _statusCode: number = 500) {
        super(
            {
                response: {},
                error: {
                    code: _code,
                    message: _message,
                },
            },
            _statusCode,
        );
    }
}
