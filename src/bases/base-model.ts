import { IGenericType } from '../interfaces/types/generictype';
import { IObjectMap } from '../interfaces/types/object-map';
import DefaultClass from './default-class';

interface IModel<T, R, N> {
    new (data: R, fieldMap: N): T;
}

interface ISerialize<T> {
    toJSON(): Readonly<T>;
}

export default function CreateModel<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    R extends Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    E extends IModel<ISerialize<any>, any, any> = typeof DefaultClass,
    N extends Record<string, Record<string, string>> = IObjectMap,
>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapper: Readonly<IObjectMap<string | ((data: R, fieldMap: N) => any)>>,
    ext?: E,
) {
    const Parent = ext ?? DefaultClass;

    return class extends Parent {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(data: R, fieldMap: N) {
            super(data, fieldMap);

            Object.keys(mapper).forEach((key) => {
                let m = mapper[key];

                if (typeof m === 'function') {
                    m = m(data, fieldMap);
                } else {
                    m = data[m];
                }

                Object.defineProperty(this, key, {
                    get: () => m,
                    enumerable: true,
                    configurable: true,
                });
            });
        }

        public toJSON() {
            const ret: IGenericType = {
                ...super.toJSON(),
            };

            Object.keys(mapper).forEach((key) => {
                ret[key] = (this as IGenericType)[key];
            });

            return ret;
        }
        // NOTE: Instancetype will get all of the fields defined by the parent class
        // https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype
    } as IModel<Readonly<T> & ISerialize<T> & InstanceType<E>, R, N>;
}
