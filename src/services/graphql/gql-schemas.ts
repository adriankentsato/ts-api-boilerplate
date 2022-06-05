/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */
import { glob } from 'glob';
import { join as pathJoin } from 'node:path';
import { IGenericType } from '../../interfaces/types/generictype';

export default class GqlSchemas {
    private static typeDefs: string[] = [];

    private static resolvers: IGenericType[] = [];

    public static async TypeDefinitions() {
        if (GqlSchemas.typeDefs.length === 0) {
            const files = await glob(pathJoin(__dirname, '/**/schema.?s'));

            // eslint-disable-next-line no-restricted-syntax
            for (const file of files) {
                // eslint-disable-next-line no-await-in-loop
                const { GQL_SCHEMA } = await import(file);

                GqlSchemas.typeDefs.push(GQL_SCHEMA);
            }
        }

        return GqlSchemas.typeDefs;
    }

    public static async Resolvers() {
        if (GqlSchemas.resolvers.length === 0) {
            const files = await glob(pathJoin(__dirname, '/**/resolvers.?s'));

            // eslint-disable-next-line no-restricted-syntax
            for (const file of files) {
                // eslint-disable-next-line no-await-in-loop
                const { GQL_RESOLVERS } = await import(file);

                GqlSchemas.resolvers.push(GQL_RESOLVERS);
            }
        }

        return GqlSchemas.resolvers;
    }
}
