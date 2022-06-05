/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */

interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export default class User implements IUser {
    id: number;

    firstName: string;

    lastName: string;

    email: string;

    constructor(_user: IUser) {
        this.id = _user.id;
        this.firstName = _user.firstName;
        this.lastName = _user.lastName;
        this.email = _user.email;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
