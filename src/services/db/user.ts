/*!
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 09, 2022
 */
/** */

import DataLoader from 'dataloader';
import { SelectQueryBuilder } from 'typeorm';

import User, { TUserField, USER_FIELDS } from '../../models/user';
import { IObjectKeysMap, IObjectMap } from '../../interfaces/types/object-map';
import GetModelFieldList from '../../utils/get-model-field-list';
import BaseClass from '../../utils/base-class';
import Database from '../../integrations/db';
import { TResult } from '../../interfaces/types/result';
import { IGenericType } from '../../interfaces/types/generictype';
import { TNullable } from '../../interfaces/types/nullable';
import { check } from '../../utils/validate';

const KEY_TO_DB_FIELD: IObjectMap<string> = {
    id: 'id',
    username: 'username',
    firstName: 'first_name',
    lastName: 'last_name',
    email: 'email',
};

const DB_FIELDS = ['id', 'username', 'first_name', 'last_name', 'email'] as const;

type TUserDb = IObjectKeysMap<typeof DB_FIELDS, TNullable<string>>;

interface IGetUser {
    fields: TUserField[];
    id?: number;
    email?: string;
}

export default class UserService extends BaseClass {
    private getUser: DataLoader<IGetUser, TResult<TNullable<User>>>;

    constructor(private readonly connectionString: string) {
        super();

        this.getUser = new DataLoader(
            async (_data) => {
                const db = this.getComponent(Database);

                // return immediately if we dont have the dependency.
                if (!db) {
                    return _data.map<TResult<User>>(() => ({ ok: false, error: new Error('No database dependency.') }));
                }

                const users: IObjectMap<TUserDb> = {};

                const ids: number[] = _data.filter((_d) => _d.id != null).map((_d) => _d.id!);
                const emails: string[] = _data.filter((_d) => _d.email).map((_d) => _d.email!);

                let query: SelectQueryBuilder<IGenericType>;
                let fields;
                let conn;
                let rows;

                // Let's get a connection first before doing anything.
                conn = await db.getConnection('postgres', this.connectionString);

                if (!conn.ok) {
                    const { ok, error } = conn;
                    return _data.map<TResult<User>>(() => ({ ok, error }));
                }

                conn = conn.value;

                // Let's get the list of fields to be queried.
                fields = GetModelFieldList(
                    USER_FIELDS,
                    _data.map((_d) => _d.fields),
                );

                // add in the ID and email
                fields.id = 0;
                fields.email = 0;

                fields = Object.keys(fields).map((field) => KEY_TO_DB_FIELD[field]);

                // Building the query.
                query = conn.manager.createQueryBuilder().select();

                fields.forEach((_field) => {
                    query = query.addSelect(`u.${_field}`, _field);
                });

                query = query
                    .from('users', 'u')
                    .where('u.id IN( :ids )', { ids })
                    .orWhere('u.email IN( :emails )', { emails });

                // Getting the list from the database.
                rows = await query
                    .getRawMany()
                    .then<TResult<TUserDb[]>>((_rows: TUserDb[]) => ({ ok: true, value: _rows }))
                    .catch<TResult<TUserDb[]>>((_err) => ({ ok: false, error: _err as Error }));

                if (!rows.ok) {
                    const { ok, error } = rows;
                    return _data.map<TResult<User>>(() => ({ ok, error }));
                }

                rows = rows.value;

                // if nothing is returned from the query let's return immediately
                if (rows.length === 0) {
                    return _data.map<TResult<TNullable<User>>>(() => ({ ok: true, value: null }));
                }
                // Optimization: Convert the list of users into an object map so it will be easier to "find" later
                rows.forEach((_row) => {
                    users[`id_${_row.id}`] = _row;
                    users[`email_${_row.email}`] = _row;
                });

                // Let's iterate through the input list, we don't want the input list to be modified.
                return _data.map<TResult<TNullable<User>>>((d) => {
                    const dummyUser: IGenericType = {};

                    let user: TNullable<IGenericType<TUserDb>>;
                    let keys;

                    keys = d.fields;

                    // Getting the user if there's an ID.
                    if (d.id) {
                        user = users[`id_${d.id}`];
                    }

                    // Getting the user if there's an email.
                    if (d.email) {
                        user = users[`email_${d.email}`];
                    }

                    // Eventually the requested ID or email will not exist on the database so we'll just return a null.
                    if (!user) {
                        return { ok: true, value: null };
                    }

                    // Let's check first if the input field doesn't have a list, so we will give him the default.
                    if (d.fields.length === 0) {
                        keys = USER_FIELDS as unknown as TUserField[];
                    }

                    // Iterate through the key/field list to remap things from DB into our own model.
                    keys.forEach((key) => {
                        dummyUser[key] = user[KEY_TO_DB_FIELD[key]];
                    });

                    // Return with a new instance of user.
                    return { ok: true, value: new User(dummyUser) };
                });
            },
            {
                // Cache keys will be either an ID or an email.
                cacheKeyFn: (d) => d.id || d.email,
            },
        );
    }

    public async GetById(_id: number, _fields: TUserField[] = []): Promise<TResult<TNullable<User>>> {
        const db = this.getComponent(Database);

        if (!db) {
            return { ok: false, error: new Error('No database dependency.') };
        }

        const isID = await check(_id, 'Not an ID.', (v) => v.exists().isNumeric().isInt({ gt: 0 }));

        if (!isID) {
            return { ok: false, error: new Error('Not an ID.') };
        }

        const isFieldsChecked = await this.checkFields(_fields);

        if (!isFieldsChecked) {
            return { ok: false, error: new Error('Field list not supported.') };
        }

        return this.getUser.load({ id: +_id, fields: _fields });
    }

    public async GetByEmail(_email: string, _fields: TUserField[] = []): Promise<TResult<TNullable<User>>> {
        const db = this.getComponent(Database);

        if (!db) {
            return { ok: false, error: new Error('No database dependency.') };
        }

        const isEmail = await check(_email, 'Not an email.', (v) => v.exists().isString().not().isEmpty().isEmail());

        if (!isEmail) {
            return { ok: false, error: new Error('Not an email.') };
        }

        const isFieldsChecked = await this.checkFields(_fields);

        if (!isFieldsChecked) {
            return { ok: false, error: new Error('Field list not supported.') };
        }

        return this.getUser.load({ email: _email, fields: _fields });
    }

    // eslint-disable-next-line class-methods-use-this
    private async checkFields(_fields: TUserField[]): Promise<boolean> {
        // Check for length zero first.
        if (_fields && Array.isArray(_fields) && _fields.length === 0) {
            return true;
        }

        const isFieldsCheck = await check(_fields, 'Not field.', (v) => v.exists().bail().isArray());

        if (!isFieldsCheck) return false;

        const isFieldCheck = await Promise.all(
            _fields.map((_field) => check(_field, 'Not in list', (v) => v.isString().bail().isIn(USER_FIELDS))),
        );

        if (isFieldCheck.includes(false)) {
            return false;
        }

        return true;
    }
}
