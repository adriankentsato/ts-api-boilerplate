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
            async (data) => {
                const db = this.getComponent(Database);

                // return immediately if we dont have the dependency.
                if (!db) {
                    return data.map<TResult<User>>(() => ({ ok: false, error: new Error('No database.') }));
                }

                const ids: number[] = data.filter((d) => d.id != null).map((d) => d.id!);
                const emails: string[] = data.filter((d) => d.email).map((d) => d.email!);

                let query: SelectQueryBuilder<IGenericType>;
                let fields;
                let conn;
                let rows;

                fields = GetModelFieldList(
                    USER_FIELDS,
                    data.map((d) => d.fields),
                );

                // add in the ID and email
                fields.id = 0;
                fields.email = 0;

                fields = Object.keys(fields).map((field) => KEY_TO_DB_FIELD[field]);

                conn = await db.getConnection('postgres', this.connectionString);

                if (!conn.ok) {
                    const { ok, error } = conn;
                    return data.map<TResult<User>>(() => ({ ok, error }));
                }

                conn = conn.value;

                query = conn.manager.createQueryBuilder().select();

                fields.forEach((field) => {
                    query = query.addSelect(`u.${field}`, field);
                });

                query = query
                    .from('users', 'u')
                    .where('u.id IN( :ids )', { ids })
                    .orWhere('u.email IN( :emails )', { emails });

                rows = await query
                    .getRawMany()
                    .then<TResult<TUserDb[]>>((users: TUserDb[]) => ({ ok: true, value: users }))
                    .catch<TResult<TUserDb[]>>((err) => ({ ok: false, error: err as Error }));

                if (!rows.ok) {
                    const { ok, error } = rows;
                    return data.map<TResult<User>>(() => ({ ok, error }));
                }

                rows = rows.value;

                // if nothing is returned from the query let's return immediately
                if (rows.length === 0) {
                    return data.map<TResult<TNullable<User>>>(() => ({ ok: true, value: null }));
                }

                const users: IObjectMap<TUserDb> = {};

                // Optimization: Convert the list of users into an object map so it will be easier to "find" later
                rows.forEach((row) => {
                    users[`id_${row.id}`] = row;
                    users[`email_${row.email}`] = row;
                });

                return data.map<TResult<TNullable<User>>>((d) => {
                    const dummyUser: IGenericType = {};

                    let user: TNullable<IGenericType<TUserDb>>;
                    let keys;

                    keys = d.fields;

                    if (d.fields.length === 0) {
                        keys = USER_FIELDS as unknown as TUserField[];
                    }

                    if (d.id) {
                        user = users[`id_${d.id}`];
                    }

                    if (d.email) {
                        user = users[`email_${d.email}`];
                    }

                    if (!user) {
                        return { ok: true, value: null };
                    }

                    keys.forEach((key) => {
                        dummyUser[key] = user[KEY_TO_DB_FIELD[key]];
                    });

                    return { ok: true, value: new User(dummyUser) };
                });
            },
            {
                cacheKeyFn: (d) => d.id || d.email,
            },
        );
    }

    public async GetById(_id: number, _fields: TUserField[] = []): Promise<TResult<TNullable<User>>> {
        const isID = await check(_id, 'Not an ID.', (v) => v.exists().isNumeric().isInt({ gt: 0 }));

        if (!isID) {
            return { ok: false, error: new Error('Not an ID.') };
        }

        return this.getUser.load({ id: +_id, fields: _fields });
    }

    public async GetByEmail(_email: string, _fields: TUserField[] = []): Promise<TResult<TNullable<User>>> {
        const isEmail = await check(_email, 'Not an email.', (v) => v.exists().isString().not().isEmpty().isEmail());

        if (!isEmail) {
            return { ok: false, error: new Error('Not an email.') };
        }

        return this.getUser.load({ email: _email, fields: _fields });
    }
}
