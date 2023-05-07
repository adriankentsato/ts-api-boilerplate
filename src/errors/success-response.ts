/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 7, 2023
 */

/** */
import { IGenericType } from '../interfaces/generictype';
import ApiReponse from './api-response';

export default class SuccessResponse extends ApiReponse {
    public constructor(data: IGenericType, statusCode: number = 200) {
        super(
            {
                response: data,
                error: {},
            },
            statusCode,
        );
    }
}
