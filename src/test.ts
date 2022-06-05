import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';

import GqlSchemas from './services/graphql/gql-schemas';

Promise.all([GqlSchemas.TypeDefinitions(), GqlSchemas.Resolvers()])
    .then(([typeDefs, resolvers]) => {
        const schema = makeExecutableSchema({
            typeDefs,
            resolvers,
        });

        return graphql({
            schema,
            source: `{
                user(id: 1) {
                    firstName
                    fullName
                    permissions {
                        enabled
                        name
                    }
                }
            }`,
            contextValue: { hello: 'world' },
        });
    })
    .then((data) => {
        console.info(data);
    });
