export * from './user.body';
export * from './auth.body';

export interface FindReqQuery {
    page: number;

    size: number;

    query?: string;

    sort?: string;
}
