/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import { QueryRunner } from 'typeorm';
import { GetConnection } from './queue';

export default class PostgreSQL {
    private connectionString;

    private connection?: QueryRunner;

    public constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    public async Connect() {
        if (this.connection == null) {
            this.connection = await GetConnection(this.connectionString);
        }

        return this;
    }

    public get Connection() {
        if (this.connection == null) {
            throw new Error('Connection not available, please call connect.');
        }

        return this.connection;
    }
}
