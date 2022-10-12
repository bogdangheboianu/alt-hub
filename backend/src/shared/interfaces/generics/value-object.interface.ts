export interface IValueObject<ValueObject, ValueType> {
    getValue(): ValueType;

    equals(to: ValueObject): boolean;
}
