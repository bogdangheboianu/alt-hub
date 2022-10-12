import { IStepData } from '@shared/interfaces/step-data.interface';

export type Steps<StepKey extends string> = Record<StepKey, IStepData<any>>;
