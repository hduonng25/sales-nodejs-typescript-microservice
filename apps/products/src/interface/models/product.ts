import { IProductDetail } from '.';

export interface IProduct {
    id: string;

    created_date?: Date;

    created_by?: string;

    is_deleted?: boolean;

    price: number;

    name: string;

    note: string;

    product_details: IProductDetail[];
}
