import { IGenericType } from '../interfaces/types/generictype';
import { IObjectMap } from '../interfaces/types/object-map';

interface IModel<T, R> {
    new (data: R): T;
}

interface ISerialize<T> {
    toJSON(): Readonly<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreateModel<T extends Record<string, any>, R extends Record<string, any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapper: Readonly<IObjectMap<string | ((data: R) => any)>>,
) {
    return class {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(data: R) {
            Object.keys(mapper).forEach((key) => {
                Object.defineProperty(this, key, {
                    get: () => {
                        const m = mapper[key];

                        if (typeof m === 'string') {
                            return data[m];
                        }

                        return m(data);
                    },
                    enumerable: true,
                    configurable: true,
                });
            });
        }

        public toJSON() {
            const ret: IGenericType = {};

            Object.keys(mapper).forEach((key) => {
                ret[key] = (this as IGenericType)[key];
            });

            return ret;
        }
    } as IModel<Readonly<T> & ISerialize<T>, R>;
}
