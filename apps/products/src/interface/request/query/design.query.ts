import { CommonFindQuery } from '.';

export interface DesignsFindQuery extends CommonFindQuery {}

export interface DesignsFindByNameQuery extends CommonFindQuery {
    name: string;
}
