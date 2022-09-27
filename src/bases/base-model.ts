import { IGenericType } from '../interfaces/types/generictype';
import { IObjectMap } from '../interfaces/types/object-map';
import { TVersionedSchema } from '../interfaces/types/versioned-schema';
import DefaultClass from './default-class';

interface IModel<Input, Output, Mappers> {
    new (data: Input, fieldMap: Mappers): Output;
}

interface ISerialize<T> {
    toJSON(): Readonly<T>;
}

type TMapper<
    Input extends Record<string, unknown>,
    Output extends Record<string, unknown>,
    Mappers extends Record<string, unknown>> = {
    [K in keyof Output]: (keyof Input) | ((data: Input, mappers: Mappers) => Output[K]) | ({ val: keyof Input; def: Output[K] });
};

type TOutputMap<
    T extends TVersionedSchema<string, Record<string, unknown>>,
    Output extends Record<string, unknown>,
    Mappers extends Record<string, unknown>> = {
    [K in T['version']]: TMapper<Extract<T, { version: K }>['schema'], Output, Mappers>;
};

export default abstract class Model {
    static Create<
        Input extends TVersionedSchema<string, Record<string, unknown>>,
        Output extends Record<string, unknown>,
        Mappers extends Record<string, Record<string, unknown>> = IObjectMap,
        Parent extends IModel<ISerialize<unknown>, unknown, unknown> = typeof DefaultClass,
        Sym extends Symbol = Symbol,
    >(outMap: TOutputMap<Input, Output, Mappers>, parent?: Parent, sym?: Sym) {
        const Parent = parent ?? DefaultClass;

        const Child = class extends Parent {

            constructor(data: Input, mappers: Mappers, s?: Symbol) {
                let exp: TMapper<Input['schema'], Output, Mappers>;

                super(data, mappers, (Parent as IGenericType).sym);

                // This checks for abstraction.
                if (sym && s != sym) {
                    throw new Error('Cannot instantiate this class.');
                }

                if (!data.version) {
                    throw new Error('Malformed input, cannot instantiate.');
                }

                exp = (outMap as IGenericType)[data.version];

                // Check if version is supported.
                if (!exp) {
                    throw new Error('Version not supported.');
                }

                Object.keys(exp).forEach((key) => {
                    let m;
                    
                    m = exp[key];

                    if (typeof m === 'function') {
                        m = m(exp, mappers);
                    } else if (typeof m === 'string') {
                        m = exp[m];
                    } else {
                        const n = m as IGenericType;

                        m = exp[n.val] || n.def;
                    }

                    Object.defineProperty(this, key, {
                        get: () => m,
                        enumerable: true,
                        configurable: true,
                    });
                });
            }

            toJSON() {
                const ret: IGenericType = {
                    ...super.toJSON(),
                };

                Object.keys((outMap as IGenericType)[Object.keys(outMap)[0]]).forEach((k) => {
                    ret[k] = (this as IGenericType)[k];
                });

                return ret;
            }
        } as IModel<Input, Readonly<Output> & ISerialize<Output> & InstanceType<Parent>, Mappers>;

        (Child as IGenericType).sym = sym;

        return Child;
    }
}
