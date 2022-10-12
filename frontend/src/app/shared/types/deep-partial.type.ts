export type DeepPartial<T> = T extends Function
                             ? T
                             : T extends Array<infer InferredArrayMember>
                               ? DeepPartialArray<InferredArrayMember>
                               : T extends Object
                                 ? DeepPartialObject<T>
                                 : T | undefined

interface DeepPartialArray<T> extends Array<DeepPartial<T>> {
}

type DeepPartialObject<T> = {
    [Key in keyof T]?: DeepPartial<T[Key]>
}
