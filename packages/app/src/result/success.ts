import { Any } from 'utils';
import { HttpsStatus } from '../constant/status';
import { ResultSuccess } from './result';

export const ok = (data: Any): ResultSuccess => {
    return { status: HttpsStatus.OK, data: data };
};

export const created = (data: Any): ResultSuccess => {
    return { status: HttpsStatus.CREATED, data: data };
};

export const noContent = (): ResultSuccess => {
    return { status: HttpsStatus.NO_CONTENT, data: undefined };
};
