import stringify from 'fast-safe-stringify';

export class Exception extends Error {
    constructor(message: string | Object) {
        super( stringify.stable( message ) );
    }
}
