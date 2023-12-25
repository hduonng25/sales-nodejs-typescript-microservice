import { HttpsStatus } from '../constant/status';
import { Any } from 'utils';

export interface ResultSuccess {
    status: HttpsStatus;
    data: Any;
}

export interface ResultError {
    status: HttpsStatus;
    code?: string;
    description?: {
        vi: string;
        en: string;
    };
    errors?: ErrorDetail[];
    details?: Any;
}

export interface ErrorDetail {
    location?: string;
    value?: Any;
    param?: string;
    message?: string;
}

export type Result = ResultSuccess | ResultError;
