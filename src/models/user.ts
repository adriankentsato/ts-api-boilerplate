/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */
import { TNullable } from '../interfaces/types/nullable';
import { IObjectKeysMap } from '../interfaces/types/object-map';

export const USER_FIELDS = ['id', 'firstName', 'lastName', 'email', 'password'] as const;

export type TUserField = (typeof USER_FIELDS)[number];

interface IUser extends IObjectKeysMap<typeof USER_FIELDS, TNullable<string>> {}

export default class User {
    id: TNullable<number>;

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    constructor(_user: IUser) {
        this.id = +(_user.id || '') || null;
        this.firstName = _user.firstName || '';
        this.lastName = _user.lastName || '';
        this.email = _user.email || '';
        this.password = _user.password || '';
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
