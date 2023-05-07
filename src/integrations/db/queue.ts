/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: May 4, 2023
 */

/** */
import Queue from 'better-queue';
import { DataSource, QueryRunner } from 'typeorm';

type DsFactory = (connectionString: string) => DataSource;
type ConnectionTester = (connection: QueryRunner) => Promise<unknown>;

export interface IQueue {
    GetConnection: (connStr: string) => Promise<QueryRunner>;
    ReleaseAllConnections: () => Promise<void>;
}

export default function CreateQueue(context: string, factory: DsFactory, test: ConnectionTester): IQueue {
    const sources = new Map<string, DataSource>();

    const queue = new Queue(async (connectionString: string, cb) => {
        let source = sources.get(connectionString);

        console.info(context, 'Getting connection pool.');

        if (source == null) {
            console.info(context, 'Connection pool not found, creating a new one.');

            try {
                // Check if it can create and connect to the database.
                source = await factory(connectionString).initialize();
            } catch (e) {
                console.info(context, 'Cannot connect to database.');
                return cb(e);
            }

            sources.set(connectionString, source);

            console.info(context, 'Successfully created new connection pool.');
        }

        console.info(context, 'Returning connection pool.');

        return cb(null, source);
    });

    return {
        GetConnection: async (connectionString: string): Promise<QueryRunner> => {
            console.info(context, 'Getting connection from pool.');
            return new Promise((resolve, reject) => {
                queue.push(connectionString, async (err, source: DataSource) => {
                    if (err) reject(err);
                    else {
                        const connection = source.createQueryRunner();

                        try {
                            await test(connection);

                            console.info(context, 'Connection establised.');
                            resolve(connection);
                        } catch (e) {
                            await connection.release().catch();
                            console.error(context, 'Cannot get connection from pool.');
                            reject(e);
                        }
                    }
                });
            });
        },
        ReleaseAllConnections: async () => {
            if (sources.size > 0) {
                await Promise.all([...sources.values()].map((source) => source.destroy()));
            }

            sources.clear();
        },
    };
}
