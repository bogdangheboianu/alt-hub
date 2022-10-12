export interface IntervalPoint<T> {
    getValue(): T;

    equals(to: IntervalPoint<T>): boolean;

    isBefore(point: IntervalPoint<T>): boolean;

    isBeforeOrEqual(point: IntervalPoint<T>): boolean;

    isAfter(point: IntervalPoint<T>): boolean;

    isAfterOrEqual(point: IntervalPoint<T>): boolean;

    isSet(): boolean;

    isNotSet(): boolean;
}
