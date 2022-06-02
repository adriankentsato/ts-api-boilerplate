/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2022
 */

/** */
import { IGenericType } from '../interfaces/types/generictype';
import ApiReponse from './api-response';

export default class SuccessResponse extends ApiReponse {
    constructor(_data: IGenericType, _statusCode: number = 200) {
        super(
            {
                response: _data,
                error: {},
            },
            _statusCode,
        );
    }
}
