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
    '[MySQL]',
    (connectionString) =>
        new DataSource({
            type: 'mysql',
            url: connectionString,
            synchronize: false,
            ssl: { rejectUnauthorized: false },
            poolSize: 100,
        }),
    (conn) => conn.query('SELECT 1'),
);

export default class MySqlDatabase extends BaseDatabase {
    // eslint-disable-next-line class-methods-use-this
    protected get queue(): IQueue {
        return Queue;
    }
}
