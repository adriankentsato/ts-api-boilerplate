/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { DataSource } from 'typeorm';
import CreateQueue, { IQueue } from '../queue';
import BaseDatabase from '../base';

const Queue = CreateQueue(
    '[SQLite]',
    (connectionString) =>
        new DataSource({
            type: 'sqlite',
            database: connectionString,
            synchronize: false,
        }),
    (conn) => conn.query('SELECT 1'),
);

export default class SQLiteDatabase extends BaseDatabase {
    // eslint-disable-next-line class-methods-use-this
    protected get queue(): IQueue {
        return Queue;
    }
}
