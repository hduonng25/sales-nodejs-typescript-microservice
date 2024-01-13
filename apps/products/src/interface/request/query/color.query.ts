import { CommonFindQuery } from '.';

export interface ColorFindQuery extends CommonFindQuery {}

export interface ColorFindByNameQuery extends CommonFindQuery {
    name: string;
}
