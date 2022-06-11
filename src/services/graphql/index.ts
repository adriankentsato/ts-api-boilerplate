/*!
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 11, 2022
 */

/** */

import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';

import { IGenericType } from '../../interfaces/types/generictype';
import { TResult } from '../../interfaces/types/result';

import GqlSchemas from './gql-schemas';

export default async function GraphQLService(
    query: string,
    context: IGenericType = {},
    vars: IGenericType = {},
): Promise<TResult<IGenericType>> {
    return Promise.all([GqlSchemas.TypeDefinitions(), GqlSchemas.Resolvers()])
        .then(([typeDefs, resolvers]) => {
            const schema = makeExecutableSchema({
                typeDefs,
                resolvers,
            });

            return graphql({
                schema,
                source: query,
                contextValue: context,
                variableValues: vars,
            });
        })
        .then<TResult<IGenericType>>((data) => {
            if (data.errors && data.errors.length > 0) {
                return { ok: false, error: data.errors[0] as Error };
            }

            return { ok: true, value: data.data };
        })
        .catch((err) => ({ ok: false, error: err as Error }));
}
