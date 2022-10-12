import { ISelectInputOption } from '@shared/interfaces/select-input-option.interface';

export const valueIsSelectInputOption = (value: any): value is ISelectInputOption => {
    return typeof value === 'object' && 'id' in value && 'name' in value;
};
