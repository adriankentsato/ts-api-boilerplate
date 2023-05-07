import { Handler } from './handler';

export type Method = 'get' | 'post' | 'patch' | 'delete';

export interface IRoute {
    path: string;
    method: Method;
    handlers: Handler[];
}
