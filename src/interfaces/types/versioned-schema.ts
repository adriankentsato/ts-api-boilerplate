export interface TVersionedSchema<K extends string, V extends Record<string, unknown>> {
    version: K;
    schema: V;
}
