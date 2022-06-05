/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */

export default {};
export const GQL_SCHEMA = `
    type Permission {
        id: ID!
        userId: ID!
        enabled: Boolean
        name: String
    }

    type Query {
        userPermissions(userId: ID!): [Permission]
    }
`;
