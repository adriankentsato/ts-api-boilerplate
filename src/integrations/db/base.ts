/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { QueryRunner } from 'typeorm';
import { IQueue } from './queue';

export default class BaseDatabase {
    private connectionString;

    private connection?: QueryRunner;

    public constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    public async Connect() {
        if (this.connection == null) {
            this.connection = await this.queue.GetConnection(this.connectionString);
        }

        return this;
    }

    public get Connection() {
        if (this.connection == null) {
            throw new Error('Connection not available, please call connect.');
        }

        return this.connection;
    }

    // eslint-disable-next-line class-methods-use-this
    protected get queue(): IQueue {
        throw new Error('Unimplemented method.');
    }
}
