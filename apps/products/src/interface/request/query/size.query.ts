import { CommonFindQuery } from '.';

export interface SizeFindQuery extends CommonFindQuery {}

export interface SizeFindByNameQuery extends CommonFindQuery {
    name: string;
}
