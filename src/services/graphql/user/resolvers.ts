/**
 * MIT License
 *
 * Author: Kent Adrian Sato
 * Date: June 2, 2022
 */

/** */
import { IGenericType } from '../../../interfaces/types/generictype';
import User from '../../../models/user';

export default {};
export const GQL_RESOLVERS = {
    Query: {
        users: () => [],
        user: () =>
            new User({
                id: 1,
                firstName: 'Hello',
                lastName: 'World',
                email: 'hello@world.com',
            }),
    },
    User: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        firstName: (parent: IGenericType, _: never, context: IGenericType) => {
            const hasAccess = true;
            if (hasAccess) {
                return parent.firstName + context.hello;
            }

            return null;
        },
        greeting: (parent: IGenericType) => `Hi ${parent.fullName}!`,
        permissions: () => [],
    },
};
