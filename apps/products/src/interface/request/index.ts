export * from './color.body';
export * from './size.body';
export * from './design.body';
export * from './metarial.body';
export * from './prouduct.body';

export interface FindReqQuery {
    page: number;

    size: number;

    query?: string;

    sort?: string;
}
