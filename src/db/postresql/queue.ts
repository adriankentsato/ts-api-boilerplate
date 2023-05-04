/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import Queue from 'better-queue';
import { DataSource, QueryRunner } from 'typeorm';

const PgSources = new Map<string, DataSource>();

const Q = new Queue(async (connectionString: string, cb) => {
    let pgSource = PgSources.get(connectionString);

    console.info('[PostgreSQL] Getting connection pool.');

    if (pgSource == null) {
        console.info('[PostgreSQL] Connection pool not found, creating a new one.');

        try {
            // Check if it can create and connecto to the database.
            pgSource = await new DataSource({
                type: 'postgres',
                url: connectionString,
                synchronize: false,
                ssl: { rejectUnauthorized: false },
                poolSize: 100,
            }).initialize();
        } catch (e) {
            console.info('[PostgreSQL] Cannot connect to database.');
            return cb(e);
        }

        PgSources.set(connectionString, pgSource);

        console.info('[PostgreSQL] Successfully created new connection pool.');
    }

    console.info('[PostgreSQL] Returning connection pool.');

    return cb(null, pgSource);
});

export async function GetConnection(connectionString: string): Promise<QueryRunner> {
    console.info('[PostgreSQL] Getting connection from pool.');
    return new Promise((resolve, reject) => {
        Q.push(connectionString, async (err, source: DataSource) => {
            if (err) reject(err);
            else {
                try {
                    const connection = source.createQueryRunner();

                    await connection.query('SELECT 1');

                    console.info('[PostgreSQL] Connection establised.');
                    resolve(connection);
                } catch (e) {
                    console.error('[PostgreSQL] Cannot get connection from pool.');
                    reject(e);
                }
            }
        });
    });
}

export async function ReleaseAllConnections() {
    if (PgSources.size > 0) {
        await Promise.all([...PgSources.values()].map((source) => source.destroy()));
    }

    PgSources.clear();
}
