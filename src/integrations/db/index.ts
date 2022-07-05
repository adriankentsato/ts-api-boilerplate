import { DataSource, QueryRunner } from 'typeorm';
import Queue from 'better-queue';
import BaseClass from '../../utils/base-class';
import { TDbType } from '../../interfaces/types/db-types';
import getDbFactory from './factories';
import { TResult } from '../../interfaces/types/result';

interface IQueueParams {
    connString: string;
    dbType: TDbType;
}

export default class Database extends BaseClass {
    private sources: Map<string, DataSource>;

    private queue: Queue<IQueueParams, DataSource>;

    constructor() {
        super();

        this.sources = new Map();
        this.queue = new Queue(async (_param: IQueueParams, cb) => {
            const { dbType, connString } = _param;
            const factory = getDbFactory(dbType);
            const mapKey = `${dbType} - ${connString}`;

            let source = this.sources.get(mapKey);

            console.info(factory.context, 'Getting database connection...');

            if (source == null) {
                console.info(factory.context, 'Connection not found, creating...');

                try {
                    source = await factory.dsFactory(connString).initialize();
                } catch (e) {
                    console.error(factory.context, 'Cannot connect to the database.', e);
                    return cb(e);
                }

                this.sources.set(mapKey, source);
                console.info(factory.context, 'Connected to the database.');
            }

            console.info(factory.context, 'Returning database connection.');

            return cb(null, source);
        });
    }

    async GetConnection(_dbType: TDbType, _connString: string): Promise<TResult<QueryRunner>> {
        return new Promise((resolve) => {
            this.queue.push({ connString: _connString, dbType: _dbType }, async (err, ds) => {
                if (err) resolve({ ok: false, error: err });
                else {
                    const conn = ds.createQueryRunner();
                    const factory = getDbFactory(_dbType);

                    try {
                        await conn.connect();
                        await factory.connTest(conn);

                        console.info(factory.context, 'Connection established.');

                        resolve({ ok: true, value: conn });
                    } catch (e) {
                        await conn.release().catch();

                        console.error(factory.context, 'Cannot get database connection.');

                        resolve({ ok: false, error: e as Error });
                    }
                }
            });
        });
    }
}

// ReleaseAllConnections: async () => {
//             if (sources.size > 0) {
//                 await Promise.all([...sources.values()].map((source) => source.destroy()));
//             }

//             sources.clear();
//         },
