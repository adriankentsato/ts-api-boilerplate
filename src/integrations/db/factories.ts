import { DataSource, QueryRunner } from 'typeorm';
import { IObjectKeysMap } from '../../interfaces/types/object-map';
import { DB_TYPES, TDbType } from '../../interfaces/types/db-types';

type DsFactory = (connectionString: string) => DataSource;
type ConnectionTester = (connection: QueryRunner) => Promise<unknown>;

interface IFactory {
    dsFactory: DsFactory;
    connTest: ConnectionTester;
    context: string;
}

const DB_FACTORIES: Readonly<IObjectKeysMap<typeof DB_TYPES, Readonly<IFactory>>> = {
    mysql: {
        context: '[MySQL]',
        connTest: (conn) => conn.query('SELECT 1'),
        dsFactory: (connStr) =>
            new DataSource({
                type: 'mysql',
                url: connStr,
                synchronize: false,
                ssl: { rejectUnauthorized: false },
                poolSize: 100,
            }),
    },
    postgres: {
        context: '[PostgreSQL]',
        connTest: (conn) => conn.query('SELECT 1'),
        dsFactory: (connStr) =>
            new DataSource({
                type: 'postgres',
                url: connStr,
                synchronize: false,
                ssl: { rejectUnauthorized: false },
                poolSize: 100,
            }),
    },
    mariadb: {
        context: '[MariaDB]',
        connTest: (conn) => conn.query('SELECT 1'),
        dsFactory: (connStr) =>
            new DataSource({
                type: 'mariadb',
                url: connStr,
                synchronize: false,
                ssl: { rejectUnauthorized: false },
                poolSize: 100,
            }),
    },
    mssql: {
        context: '[MSSQL]',
        connTest: (conn) => conn.query('SELECT 1'),
        dsFactory: (connStr) =>
            new DataSource({
                type: 'mssql',
                url: connStr,
                synchronize: false,
                extra: {
                    pool: {
                        max: 100,
                    },
                },
            }),
    },
    sqlite: {
        context: '[SQLite]',
        connTest: (conn) => conn.query('SELECT 1'),
        dsFactory: (connStr) =>
            new DataSource({
                type: 'sqlite',
                database: connStr,
                synchronize: false,
            }),
    },
};

export default function getDbFactory(dbType: TDbType) {
    return DB_FACTORIES[dbType];
}
