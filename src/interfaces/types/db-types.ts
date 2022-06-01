/**
 * MIT LICENSE
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */

export const DB_TYPES = ['mysql', 'postgres', 'mssql', 'sqlite', 'mariadb'] as const;

export type TDbType = (typeof DB_TYPES)[number];
