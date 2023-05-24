import { Handler } from './functions/handler';

export type Method = 'get' | 'post' | 'patch' | 'delete';

export interface IRoute {
    path: string;
    method: Method;
    handlers: Handler[];
}
