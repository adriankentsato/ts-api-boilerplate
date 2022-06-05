/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */

export default {};
export const GQL_SCHEMA = `
    type User {
        id: ID!
        firstName: String
        lastName: String
        email: String
        fullName: String
        greeting: String
        permissions: [Permission]
    }

    type Query {
        user(id: ID!): User
        users: [User]
    }
`;
